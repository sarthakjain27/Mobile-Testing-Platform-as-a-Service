const AWS=require('aws-sdk');
var fs=require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
var Request = require('request');
const User=require('../models/user');
const Run=require('../models/testRun.model');
const GlobalVar = require("../GlobalVar");
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var devicefarm = new AWS.DeviceFarm({apiVersion: '2015-06-23',
                                        accessKeyId:GlobalVar.AWS_ACCESS_KEY_ID_SARTHAK,
                                        secretAccessKey:GlobalVar.AWS_SECRET_ACCESS_KEY_SARTHAK,
                                        region:'us-west-2'});

getOneProjectAllRunsManager = (req,res)=>{
    console.log('Inside getOneProjectAllRunsManager');
    console.log('Getting all runs info. for the project '+req.body.projectname)
    Run.find({projectName:req.body.projectname})
    .then((runs)=>{
        res.json(runs)
    })
    .catch((err)=>{
        console.log('Error in getOneProjectAllRunsManager '+err)
        res.status(400).json("Error in getOneProjectAllRunsManager: "+err)
    })
}

getOneProjectAllRunsTester = (req,res)=>{
    console.log('Inside getOneProjectAllRunsTester');
    console.log('Getting all runs info. of user '+req.body.username+' for the project '+req.body.projectname)
    Run.find({userName:req.body.username,projectName:req.body.projectname})
    .then((runs)=>{
        res.json(runs)
    })
    .catch((err)=>{
        console.log('Error in getOneProjectAllRunsTester '+err)
        res.status(400).json("Error in getOneProjectAllRunsTester: "+err)
    })
}

getAllProjectAllRunsTester = (req,res)=>{
    console.log('Inside getAllProjectAllRunsTester');
    console.log('Getting all project runs info. of user '+req.body.username)
    Run.find({userName:req.body.username})
    .then((runs)=>{
        res.json(runs)
    })
    .catch((err)=>{
        console.log('Error in getAllProjectAllRunsTester '+err)
        res.status(400).json("Error in getAllProjectAllRunsTester: "+err)
    })
}

async function getUploadStatus(UPLOAD_ARN){
    return await devicefarm.getUpload({arn: UPLOAD_ARN}).promise().then(
        function(data){
            return data.upload.status;
        },function(error){
            console.error("getting upload failed with error: ", error);
        }
    );
}


createRun = async (req,res)=>{
    console.log('Inside createRun');
    console.log(req.body)
    console.log(req.file.path)
    
    const userName=req.body.username
    const projectName=req.body.projectname
    const runname=req.body.runname
    const appFileName=req.body.appFileName
    const appFileType=req.body.appFileType
    const devicePoolName=req.body.devicePoolName
    const devicePoolARNs=req.body.devicePoolARNs
    const testType=req.body.testType
    const testPackageFileName='zip-with-dependencies.zip'
    const testPackageFileType=req.body.testPackageFileType

    //Amit's array of test file names that need to be zipped
    const testFileNames=JSON.parse(req.body.testFileNames)

    const testPackageFile='testPackageFile/zip-with-dependencies.zip'

    let project_params={
        name:userName+'_'+projectName+'_'+runname
    }
    let PROJECT_ARN = await devicefarm.createProject(project_params).promise().then(
        function(data){
            return data.project.arn;
        },
        function (error) {
            console.log("Error creating project", "Error: ", error);
            res.status(400).json("Error creating project", "Error: ", error)
        }
    );
    console.log("Project created with name: "+projectName+'_'+runname+ " Project arn: ", PROJECT_ARN);

    // create the upload and upload files to the project
    let app_upload_params = {
        name: appFileName,
        type: appFileType,
        projectArn: PROJECT_ARN
    };
    let APP_UPLOAD = await devicefarm.createUpload(app_upload_params).promise().then(
        function(data){
            return data.upload;
        },
        function(error){
            console.log("Creating upload failed with error: ", error);
            res.status(400).json("Creating upload failed with error: ", error)
        }
    );

    let APP_UPLOAD_ARN = APP_UPLOAD.arn;
    let APP_UPLOAD_URL = APP_UPLOAD.url;
    console.log("app upload created with arn: ", APP_UPLOAD_ARN);
    console.log("uploading app file...");

    let options = {
        method: 'PUT',
        url: APP_UPLOAD_URL,
        headers: {},
        body: fs.readFileSync(req.file.path)
    };

    // wait for upload to finish
    await new Promise(function(resolve,reject){
        Request(options, function (error, response, body) {
            if (error) {
                console.log("uploading app file failed with error: ", error);
                res.status(400).json('uploading app file failed with error: '+error)
                reject(error);
            }
            resolve(body);
        });
    });

    //get the status of the app upload and make sure if finished processing before scheduling
    let APP_UPLOAD_STATUS = await getUploadStatus(APP_UPLOAD_ARN);
    console.log("app upload status is: ", APP_UPLOAD_STATUS);
    while(APP_UPLOAD_STATUS !== "SUCCEEDED"){
        await sleep(5000);
        APP_UPLOAD_STATUS = await getUploadStatus(APP_UPLOAD_ARN);
        console.log("app upload status is: ", APP_UPLOAD_STATUS);
    }

    //to delete application file stored in ./applicationFile directory
    await unlinkAsync(req.file.path)
    
    let devicePoolRules=[
        {
            "attribute": "ARN", 
            "operator": "IN",
            "value":devicePoolARNs
        }
    ]

    //create device pool
    let device_pool_params = {
        projectArn: PROJECT_ARN,
        name: devicePoolName,
        rules: devicePoolRules
    }

    let DEVICE_POOL_ARN = await devicefarm.createDevicePool(device_pool_params).promise().then(
        function(data){
            return data.devicePool.arn; 
        },function(error){
            console.log("device pool failed to create with error: ",error);
            res.status(400).json("device pool failed to create with error: ",error)
        }
    ); 
    console.log("Device pool created successfully with arn: ", DEVICE_POOL_ARN);

    let TEST_PACKAGE_UPLOAD_ARN=''
    if(testType!=='BUILTIN_FUZZ' && testType!=='BUILTIN_EXPLORER')
    {
            // create the upload and upload files to the project
        let testPackage_upload_params = {
            name: testPackageFileName,
            type: testPackageFileType,
            projectArn: PROJECT_ARN
        };
        let TEST_PACKAGE_UPLOAD = await devicefarm.createUpload(testPackage_upload_params).promise().then(
            function(data){
                return data.upload;
            },
            function(error){
                console.error("Creating upload failed with error: ", error);
                res.status(400).json("Creating upload failed with error: ", error)
            }
        );

        TEST_PACKAGE_UPLOAD_ARN = TEST_PACKAGE_UPLOAD.arn;
        let TEST_PACKAGE_UPLOAD_URL = TEST_PACKAGE_UPLOAD.url;
        console.log("test package upload created with arn: ", TEST_PACKAGE_UPLOAD_ARN);
        console.log("uploading test package file...");

        let options = {
            method: 'PUT',
            url: TEST_PACKAGE_UPLOAD_URL,
            headers: {},
            body: fs.readFileSync(testPackageFile)
        };

        // wait for upload to finish
        await new Promise(function(resolve,reject){
            Request(options, function (error, response, body) {
                if (error) {
                    console.error("uploading test package zip failed with error: ", error);
                    res.status(400).json("uploading test package zip failed with error: ", error)
                    reject(error);
                }
                resolve(body);
            });
        });

        //get the status of the app upload and make sure if finished processing before scheduling
        let TEST_PACKAGE_UPLOAD_STATUS = await getUploadStatus(TEST_PACKAGE_UPLOAD_ARN);
        console.log("test package upload status is: ", TEST_PACKAGE_UPLOAD_STATUS);
        while(TEST_PACKAGE_UPLOAD_STATUS !== "SUCCEEDED"){
            await sleep(5000);
            TEST_PACKAGE_UPLOAD_STATUS = await getUploadStatus(TEST_PACKAGE_UPLOAD_ARN);
            console.log("test package upload status is: ", TEST_PACKAGE_UPLOAD_STATUS);
        }
    }

    //schedule the run
    let schedule_run_params = {
        name: runname, 
        devicePoolArn: DEVICE_POOL_ARN, // You can get the Amazon Resource Name (ARN) of the device pool by using the list-pools CLI command.
        projectArn: PROJECT_ARN, // You can get the Amazon Resource Name (ARN) of the project by using the list-projects CLI command.
        test: {
         type: testType
        },
        appArn: APP_UPLOAD_ARN
    };
    
    if(testType!=='BUILTIN_FUZZ' && testType!=='BUILTIN_EXPLORER')
    {
        schedule_run_params.test.testPackageArn=TEST_PACKAGE_UPLOAD_ARN
    }

    let schedule_run_result = await devicefarm.scheduleRun(schedule_run_params).promise().then(
        function(data){
            return data.run;
        },function(error){
            console.error("Schedule run command failed with error: ", error);
            res.status(400).json("Schedule run command failed with error: ", error)
        }
    );
    console.log("run created successfully with run object: ", schedule_run_result);

    
    
    let arn=schedule_run_result.arn
    let name=runname
    let type=schedule_run_result.type
    let platform=schedule_run_result.platform
    let status=schedule_run_result.status
    let result=schedule_run_result.result
    let counters=schedule_run_result.counters
    let totalJobs=schedule_run_result.totalJobs
    let deviceMinutes=schedule_run_result.deviceMinutes
    const jobs = await getSubSchemas(schedule_run_result.arn)
    const newRun = new Run({userName,projectName,arn,name,type,platform,status,result,counters,totalJobs,deviceMinutes,jobs})

    console.log(newRun)
    newRun.save()
    .then(()=>{
        console.log("Inside then of newRun save")
        res.json("Run Scheduled");
    })
    .catch((err)=>{
        console.log("Inside catch of newRun save")
        res.status(400).json("Error in save of newRun inside createRun: "+err);
    })
}

async function getSubSchemas(runARN)
{
    console.log('Inisde getSubSchemas')
    let job_arr=[]
    await listJobDevicesWithinARun(runARN,'',job_arr)
    for(var i=0;i<job_arr.length;i++)
    {
        let suite_arr=[]
        await listSuitesWithinAJob(job_arr[i].arn,'',suite_arr)
        for(var j=0;j<suite_arr.length;j++)
        {
            let test_arr=[]
            await listTestsWithinASuite(suite_arr[j].arn,'',test_arr)
            for(var k=0;k<test_arr.length;k++)
            {
                let artifact_arr=[]
                await listTestArtifacts(test_arr[k].arn,'FILE','',artifact_arr)
                await listTestArtifacts(test_arr[k].arn,'LOG','',artifact_arr)
                await listTestArtifacts(test_arr[k].arn,'SCREENSHOT','',artifact_arr)
                test_arr[k].artifacts=artifact_arr
            }
            suite_arr[j].tests=test_arr
        }
        job_arr[i].deviceName=job_arr[i].device.name
        job_arr[i].deviceOS=job_arr[i].device.os
        delete job_arr[i].device
        job_arr[i].suites=suite_arr
    }
    return job_arr
}

async function listJobDevicesWithinARun(PROJECT_ARN,nextToken,jobsArray)
{
    var params={
        arn:PROJECT_ARN
    }
    if(nextToken!=='')
    {
        params.nextToken=nextToken
    }
    await devicefarm.listJobs(params).promise().then(
        async function(data) {
            console.log(data);           // successful response
            if(data.jobs.length > 0)
                jobsArray.push(...(data.jobs))
            if('nextToken' in data)
                await listJobDevicesWithinARun(PROJECT_ARN,data.nextToken,jobsArray)
      },function(error){
          console.log(error,error.stack)
      });
}

async function listSuitesWithinAJob(JOB_ARN,nextToken,suitesArray)
{
    var params={
        arn:JOB_ARN
    }
    if(nextToken!=='')
    {
        params.nextToken=nextToken
    }
    await devicefarm.listSuites(params).promise().then(
        async function(data){
            console.log(data)
            if(data.suites.length > 0)
                suitesArray.push(...(data.suites))
            if('nextToken' in data)
                await listSuitesWithinAJob(JOB_ARN,data.nextToken,suitesArray)
        },
        function(error)
        {
            console.log(error,error.stack)
        }
    )
}

async function listTestsWithinASuite(SUITE_ARN,nextToken,testsArray)
{
    var params={
        arn:SUITE_ARN
    }
    if(nextToken!=='')
    {
        params.nextToken=nextToken
    }
    await devicefarm.listTests(params).promise().then(
        async function(data){
            console.log(data)
            if(data.tests.length > 0)
                testsArray.push(...(data.tests))
            if('nextToken' in data)
            {
                await listTestsWithinASuite(SUITE_ARN,data.nextToken,testsArray)
            }
        },
        function(error)
        {
            console.log(error,error.stack)
        }
    )
}

async function listTestArtifacts(TEST_ARN,type,nextToken,artifactsArray)
{
    var params={
        arn:TEST_ARN,
        type:type
    }
    if(nextToken!=='')
    {
        params.nextToken=nextToken
    }
    await devicefarm.listArtifacts(params).promise().then(
        async function(data)
        {
            console.log(data)
            if(data.artifacts.length > 0)
                artifactsArray.push(...(data.artifacts))
            if('nextToken' in data)
            {
                await listTestArtifacts(TEST_ARN,type,data.nextToken.artifactsArray)
            }
        },function(error)
        {
            console.log(error,error.stack)
        }
    )
}

stopRun = (req,res)=>{
    console.log('Inside stopRun')
    devicefarm.stopRun({arn:req.body.RUN_ARN},function(err,data){
        if(err)
        {
            console.log(err,err.stack)
            res.status(400).json('Error in stopping the run with arn: '+req.body.RUN_ARN+' with err: '+err)
        }
        else{
            console.log('Stopping the run with arn: '+req.body.RUN_ARN)
            res.json(data);
        }
    })
}

getRunStatus = (req,res)=>{
    console.log('Inside getRunStatus')
    devicefarm.getRun({arn:req.body.RUN_ARN},function(err,data){
        if(err)
        {
            console.log(err,err.stack)
            res.status(400).json('Error in getRunStatus for run_arn: '+req.body.RUN_ARN+' err: '+err)
        }
        else{
            Run.findOne({arn:req.body.RUN_ARN})
            .then(async(run)=>{
                console.log('Run found in db: '+run)
                run.status=data.run.status
                run.result=data.run.result
                run.counters=data.run.counters
                run.totalJobs=data.run.totalJobs
                run.jobs= await getSubSchemas(req.body.RUN_ARN)
                run.deviceMinutes=data.run.deviceMinutes

                console.log('here in getRunStatus '+run)
                run.save().then(()=>{
                    console.log('Run status updated in DB')
                    res.json(data.run)
                }).catch((err)=>{
                    res.status(400).json('Unable to save run with new data: '+err);
                })
            }).catch((err)=>{
                console.log('Unable to find run with the given arn '+req.body.RUN_ARN+' err: '+err)
                res.status(400).json('Unable to find run with the given arn '+req.body.RUN_ARN+' err: '+err);
            })
        }
    })
}

getSingleRun = (req,res)=>{
    console.log('Inside getSingleRun')
    Run.findById(req.body.id)
    .then((run)=>{
        console.log(run)
        res.json(run)
    }).catch((err)=>{
        res.status(400).json('Error in getSingleBug: '+err);
    })
}

getDeviceOfARun=(req,res)=>{
    console.log('Inside getDeviceOfARun')
    Run.find({_id:req.body.rid},{jobs:{$elemMatch:{_id:req.body.jid}}})
    .then((runs)=>{
        console.log(runs[0])
        res.json(runs[0])
    }).catch((err)=>{
        res.status(400).json('Error in getDeviceOfARun: '+err);
    })
}

getTestsOfDeviceOfRun=(req,res)=>{
    console.log('Inside getTestsOfDeviceOfRun')
    Run.find({_id:req.body.rid},{jobs:{$elemMatch:{_id:req.body.jid}}})
    .then((runs)=>{
        runs[0].jobs[0].suites=runs[0].jobs[0].suites.filter((eachSuite)=>{
            return eachSuite._id==req.body.sid
        })
        res.json(runs[0])
    }).catch((err)=>{
        res.status(400).json('Error in getTestsOfDeviceOfRun: '+err);
    })
}

getArtifactsOfTestOfSuiteOfDeviceOfRun=(req,res)=>{
    console.log('Inside getArtifactsOfTestOfSuiteOfDeviceOfRun')
    Run.find({_id:req.body.rid},{jobs:{$elemMatch:{_id:req.body.jid}}})
    .then((runs)=>{
        runs[0].jobs[0].suites=runs[0].jobs[0].suites.filter((eachSuite)=>{
            return eachSuite._id==req.body.sid
        })
        runs[0].jobs[0].suites[0].tests=runs[0].jobs[0].suites[0].tests.filter((eachTest)=>{
            return eachTest._id==req.body.tid
        })
        console.log(runs[0])
        res.json(runs[0])
    }).catch((err)=>{
        res.status(400).json('Error in getArtifactsOfTestOfSuiteOfDeviceOfRun: '+err);
    })
}


exports.getOneProjectAllRunsManager=getOneProjectAllRunsManager
exports.getOneProjectAllRunsTester=getOneProjectAllRunsTester
exports.getAllProjectAllRunsTester=getAllProjectAllRunsTester
exports.createRun=createRun
exports.stopRun=stopRun
exports.getRunStatus=getRunStatus
exports.getSingleRun=getSingleRun
exports.getDeviceOfARun=getDeviceOfARun
exports.getTestsOfDeviceOfRun=getTestsOfDeviceOfRun
exports.getArtifactsOfTestOfSuiteOfDeviceOfRun=getArtifactsOfTestOfSuiteOfDeviceOfRun