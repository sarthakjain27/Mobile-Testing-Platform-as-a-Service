import React from 'react';
import axios from 'axios'
import Navbar from "../Navbar/Navbar";
import Loader from "./Loader";
import './CreateRun.css'
import Select from "react-select";

const GlobalVar = require("../../GlobalVar");

class CreateRun extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            base:GlobalVar.server_base_url,
            username:'',
            projectname:'',
            runname:'',
            appFileName:'',
            appFileType:'',
            appFile:null,
            devicePoolName:'',
            selectedOS:'',
            loading:false,
            OS:[],
            appFileTypes:[],
            devicePoolRules:[],
            projects:[],
            testType:'',
            testTypes:[],
            testPackageFileType:'',
            testPackageFileTypes:[],
            devices:[],
            selectedDevices:[],
            allOptions:[],
            allTestingFileNames:[],
            currentSetFileNames:[],
            selectedSetFileNames:[],
            checked:false,
            testFileChecked:false
        }
        
        this.onChangeProjectName=this.onChangeProjectName.bind(this);
        this.onChangeRunName=this.onChangeRunName.bind(this);
        this.onChangeAppFileName=this.onChangeAppFileName.bind(this);
        this.onChangeAppFileType=this.onChangeAppFileType.bind(this);
        this.onChangeAppFileUpload=this.onChangeAppFileUpload.bind(this);
        this.onChangeDevicePoolName=this.onChangeDevicePoolName.bind(this);
        this.onChangeOS=this.onChangeOS.bind(this);
        //this.onChangeDevices=this.onChangeDevices.bind(this);
        this.onChangeTestType=this.onChangeTestType.bind(this);
        this.onChangeCheckbox=this.onChangeCheckbox.bind(this);
        this.onChangeMultiSelect=this.onChangeMultiSelect.bind(this);
        this.onChangeMultiSelectTestFiles=this.onChangeMultiSelectTestFiles.bind(this);
        this.onChangeTestFileSelectBox=this.onChangeTestFileSelectBox.bind(this)
        this.onSubmit=this.onSubmit.bind(this);
    }

    componentDidMount(){
        this.setState({
            username:localStorage.getItem('email'),
            selectedOS:'Android',
            appFileType:'ANDROID_APP',
            appFileTypes:['ANDROID_APP','IOS_APP'],
            OS:['Android','iOS'],
            testType:'BUILTIN_FUZZ',
            testTypes:['BUILTIN_FUZZ','BUILTIN_EXPLORER','APPIUM_JAVA_JUNIT','APPIUM_JAVA_TESTNG','APPIUM_PYTHON',
                        'APPIUM_NODE','APPIUM_RUBY','CALABASH','INSTRUMENTATION','UIAUTOMATION','UIAUTOMATOR',
                        'XCTEST','XCTEST_UI'],
            testPackageFileType:'',
            testPackageFileTypes:['','','APPIUM_JAVA_JUNIT_TEST_PACKAGE','APPIUM_JAVA_TESTNG_TEST_PACKAGE','APPIUM_PYTHON_TEST_PACKAGE',
                                'APPIUM_NODE_TEST_PACKAGE','APPIUM_RUBY_TEST_PACKAGE','CALABASH_TEST_PACKAGE','INSTRUMENTATION_TEST_PACKAGE',
                                'UIAUTOMATION_TEST_PACKAGE','UIAUTOMATOR_TEST_PACKAGE','XCTEST_TEST_PACKAGE','XCTEST_UI_TEST_PACKAGE'],
            
            allOptions:[[{label:'Samsung Galaxy S9 (Unlocked) - OS 8',value:'arn:aws:devicefarm:us-west-2::device:F27533F73A894EBDACC0E1B694288B77'},
                        {label:'Samsung Galaxy S9+ (Unlocked) - OS 8',value:'arn:aws:devicefarm:us-west-2::device:E86BDD6A40FB4235957517589B2DA368'},
                        {label:'Google Pixel 2 - OS 8',value:'arn:aws:devicefarm:us-west-2::device:5F20BBED05F74D6288D51236B0FB9895'},
                        {label:'Google Pixel 2 XL - OS 8',value:'arn:aws:devicefarm:us-west-2::device:033DADA53F38438E9DA269AFC8B682E8'},
                        {label:'Samsung Galaxy Note 10 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:851BA6E2A15E410FB93178EBC62F4B48'},
                        {label:'Samsung Galaxy S10 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:A7BA5D5470264C9E98C1A599B9BFFA73'},
                        {label:'Samsung Galaxy S10+ - OS 9',value:'arn:aws:devicefarm:us-west-2::device:63CA317F2C79433081CD14AE3F2A5CB3'},
                        {label:'Samsung Galaxy S9+ (Unlocked) - OS 9',value:'arn:aws:devicefarm:us-west-2::device:8F772FF1E1AE4433B82286B1DA52FED8'},
                        {label:'Samsung Galaxy S9 (Unlocked) - OS 9',value:'arn:aws:devicefarm:us-west-2::device:CE68825ABE5A4740B56F10111FD47844'},
                        {label:'Samsung Galaxy A50 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E4438F5D016544A8BB8557C459084F9D'},
                        {label:'Samsung Galaxy A40 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:DD61B8C65B1C46A9B3D5285A448BB4A4'},
                        {label:'Samsung Galaxy A70 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:2B6903A2FEBA4AD68E79F7BCD0B81FBA'},
                        {label:'Google Pixel 3 XL - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E1F3149FDC33484D824BCFF66003E609'},
                        {label:'Google Pixel 3 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:CF6DC11E4C99430BA9A1BABAE5B45364'},
                        {label:'Google Pixel 2 XL - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E64D26FE27644A39A4BCEF009CDD8645'},
                        {label:'Google Pixel 2 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:58D6FB12B3624256AED26D0F940D4427'}
                        ],
                        [{label:'Apple iPhone 7 - OS 12',value:'arn:aws:devicefarm:us-west-2::device:334A79FA3096423885B15609A1A50E79'},
                        {label:'Apple iPhone 7 Plus - OS 12',value:'arn:aws:devicefarm:us-west-2::device:51ED4AB875C543AC97E6F65F7473E7B8'},
                        {label:'Apple iPhone 8 - OS 12',value:'arn:aws:devicefarm:us-west-2::device:AF74786682D3407D89BD16557FEE97A9'},
                        {label:'Apple iPhone X - OS 12',value:'arn:aws:devicefarm:us-west-2::device:D125AEEE8614463BAE106865CAF4470E'},
                        {label:'Apple iPhone XR - OS 12',value:'arn:aws:devicefarm:us-west-2::device:7FCC95F6737A434B9896FF77DA9E2DB6'},
                        {label:'Apple iPhone XS - OS 12',value:'arn:aws:devicefarm:us-west-2::device:A490B12A656C49678A80B5B0F7D33FA1'},
                        {label:'Apple iPhone 8 Plus - OS 12.1',value:'arn:aws:devicefarm:us-west-2::device:D89BB79517414C5E89ED1A98FEFC9D7A'},
                        {label:'Apple iPhone XS Max - OS 12.1',value:'arn:aws:devicefarm:us-west-2::device:F4A92C7101524540AB9E17F2857551D4'},
                        {label:'Apple iPhone XR - OS 12.4.1',value:'arn:aws:devicefarm:us-west-2::device:B5D4C9845DEA4EEB994FB44F572E0B5C'},
                        {label:'Apple iPhone 11 Pro - OS 13.1.3',value:'arn:aws:devicefarm:us-west-2::device:FB7DB406870A445A90958D233DF789BC'},
                        {label:'Apple iPhone 11 Pro Max - OS 13.1.3',value:'arn:aws:devicefarm:us-west-2::device:8DCCC145A8A54191B61C6EF67F27F507'},
                        {label:'Apple iPhone 11 - OS 13.1.3',value:'arn:aws:devicefarm:us-west-2::device:8EFC9DF49F09451E831E93DA281DAF9F'}
                        ]],
            devices:[{label:'Samsung Galaxy S9 (Unlocked) - OS 8',value:'arn:aws:devicefarm:us-west-2::device:F27533F73A894EBDACC0E1B694288B77'},
            {label:'Samsung Galaxy S9+ (Unlocked) - OS 8',value:'arn:aws:devicefarm:us-west-2::device:E86BDD6A40FB4235957517589B2DA368'},
            {label:'Google Pixel 2 - OS 8',value:'arn:aws:devicefarm:us-west-2::device:5F20BBED05F74D6288D51236B0FB9895'},
            {label:'Google Pixel 2 XL - OS 8',value:'arn:aws:devicefarm:us-west-2::device:033DADA53F38438E9DA269AFC8B682E8'},
            {label:'Samsung Galaxy Note 10 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:851BA6E2A15E410FB93178EBC62F4B48'},
            {label:'Samsung Galaxy S10 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:A7BA5D5470264C9E98C1A599B9BFFA73'},
            {label:'Samsung Galaxy S10+ - OS 9',value:'arn:aws:devicefarm:us-west-2::device:63CA317F2C79433081CD14AE3F2A5CB3'},
            {label:'Samsung Galaxy S9+ (Unlocked) - OS 9',value:'arn:aws:devicefarm:us-west-2::device:8F772FF1E1AE4433B82286B1DA52FED8'},
            {label:'Samsung Galaxy S9 (Unlocked) - OS 9',value:'arn:aws:devicefarm:us-west-2::device:CE68825ABE5A4740B56F10111FD47844'},
            {label:'Samsung Galaxy A50 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E4438F5D016544A8BB8557C459084F9D'},
            {label:'Samsung Galaxy A40 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:DD61B8C65B1C46A9B3D5285A448BB4A4'},
            {label:'Samsung Galaxy A70 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:2B6903A2FEBA4AD68E79F7BCD0B81FBA'},
            {label:'Google Pixel 3 XL - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E1F3149FDC33484D824BCFF66003E609'},
            {label:'Google Pixel 3 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:CF6DC11E4C99430BA9A1BABAE5B45364'},
            {label:'Google Pixel 2 XL - OS 9',value:'arn:aws:devicefarm:us-west-2::device:E64D26FE27644A39A4BCEF009CDD8645'},
            {label:'Google Pixel 2 - OS 9',value:'arn:aws:devicefarm:us-west-2::device:58D6FB12B3624256AED26D0F940D4427'}
            ],
            allTestingFileNames:[[{label:'Android Test',value:'AndroidTest.java'},
                                {label:'Android Test - 1',value:'AndroidTest1.java'},
                                {label:'Android Test - 2',value:'AndroidTest2.java'},
                                {label:'Android Test - 3',value:'AndroidTest3.java'},
                                {label:'Android Test - 4',value:'AndroidTest4.java'},
                                {label:'Android Test - 5',value:'AndroidTest5.java'}],
                                [{label:'IOS Test',value:'IOSTest.java'},
                                {label:'IOS Test - 1',value:'IOSTest1.java'},
                                {label:'IOS Test - 2',value:'IOSTest2.java'},
                                {label:'IOS Test - 3',value:'IOSTest3.java'},
                                {label:'IOS Test - 4',value:'IOSTest4.java'},
                                {label:'IOS Test - 5',value:'IOSTest5.java'}]],
            currentSetFileNames:[{label:'Android Test',value:'AndroidTest.java'},
                                {label:'Android Test - 1',value:'AndroidTest1.java'},
                                {label:'Android Test - 2',value:'AndroidTest2.java'},
                                {label:'Android Test - 3',value:'AndroidTest3.java'},
                                {label:'Android Test - 4',value:'AndroidTest4.java'},
                                {label:'Android Test - 5',value:'AndroidTest5.java'}]
        })
        let data={username:localStorage.getItem('email')}
        axios.post(this.state.base+'users/oneUser',data).then((response)=>{
            //response.data returns an array of objects containing our documents in the database
            console.log(response.data)
            //to show only the projects the tester is added in
            if(response.data.project_involved.length > 0)
            {
                this.setState({
                    projects:response.data.project_involved,
                    projectname:response.data.project_involved[0]
                })
            }
        }).catch((err)=>{
            console.log("Unable to fetch user details: "+err);
        })
    }

    onChangeProjectName(e)
    {
        this.setState({
            projectname:e.target.value
        });
    }

    onChangeRunName(e)
    {
        this.setState({
            runname:e.target.value
        })
    }

    onChangeAppFileName(e)
    {
        this.setState({
            appFileName:e.target.value
        })
    }

    onChangeAppFileType(e)
    {
        this.setState({
            appFileType:e.target.value
        })
    }

    onChangeAppFileUpload(e)
    {
        console.log(e.target.files[0])
        this.setState({
            appFile:e.target.files[0]
        });
        console.log(this.state.appFile)
    }

    onChangeDevicePoolName(e)
    {
        this.setState({
            devicePoolName:e.target.value
        })
    }    

    onChangeOS(e)
    {
        let newappFileType=''
        let ld=this.state.allOptions[0]
        let fd=this.state.allTestingFileNames[0]
        if(e.target.value==='Android')
        {
            newappFileType='ANDROID_APP'
        }
        else
        {
            newappFileType='IOS_APP'
            ld=this.state.allOptions[1]
            fd=this.state.allTestingFileNames[1]
        }
        this.setState({
            selectedOS:e.target.value,
            appFileType:newappFileType,
            selectedDevices:[],
            currentSetFileNames:[],
            devices:ld,
            currentSetFileNames:fd
        })
    }

    onChangeTestType(e)
    {
        var idx = this.state.testTypes.indexOf(e.target.value)
        this.setState({
            testType:e.target.value,
            testPackageFileType:this.state.testPackageFileTypes[idx]
        })
    }

    onChangeCheckbox(e)
    {
        const isChecked = !this.state.checked;
        this.setState(
            {
              checked: isChecked,
              selectedDevices: isChecked ? this.state.devices : []
            },
            () => {
              console.log(this.state.selectedDevices);
            }
        );
    }

    onChangeMultiSelect(opt)
    {
        let allOptionsSelected=false
        if(opt!==null)
            allOptionsSelected = opt.length === this.state.devices.length
        else
            opt=[]
        this.setState({
                checked: allOptionsSelected ? true : false,
                selectedDevices: opt
        },
          () => {
                console.log(this.state.selectedDevices);
        });
    }

    onChangeTestFileSelectBox(e)
    {
        const isChecked = !this.state.testFileChecked;
        this.setState(
            {
                testFileChecked: isChecked,
                selectedSetFileNames: isChecked ? this.state.currentSetFileNames : []
            },
            () => {
                console.log(this.state.selectedSetFileNames);
            }
        );
    }

    onChangeMultiSelectTestFiles(opt)
    {
        let allOptionsSelected=false
        if(opt!==null)
            allOptionsSelected = opt.length === this.state.currentSetFileNames.length
        else
            opt=[]
        this.setState({
                testFileChecked: allOptionsSelected ? true : false,
                selectedSetFileNames: opt
        },
          () => {
                console.log(this.state.selectedSetFileNames);
        });
    }

    onSubmit(e){
        //this is done to prevent html default action on submit of a form
        //and that we can execute our operation
        e.preventDefault();

        let numbD=this.state.selectedDevices.length

        if(numbD===0)
        {
            alert('Need to select at least 1 mobile device')
        }
        else{
            this.setState({
                loading:true
            })
            let arns=[]
            this.state.selectedDevices.forEach((eachObj)=>{
                arns.push(eachObj.value)
            })

            let testFileNames=[]
            this.state.selectedSetFileNames.forEach((eachObj)=>{
                testFileNames.push(eachObj.value)
            })
            
            let fd=new FormData();
            fd.append('username',this.state.username);
            fd.append('projectname',this.state.projectname);
            fd.append('runname',this.state.runname)
            fd.append('appFileName',this.state.appFileName)
            fd.append('appFileType',this.state.appFileType)
            fd.append('devicePoolName',this.state.devicePoolName)
            fd.append('devicePoolARNs',JSON.stringify(arns))
            fd.append('maxDevice',numbD)
            fd.append('testType',this.state.testType)
            fd.append('testPackageFileType',this.state.testPackageFileType)
            fd.append('testFileNames',JSON.stringify(testFileNames))
            fd.append('file',this.state.appFile);

            const config = { headers: { 'Content-Type': 'multipart/form-data'} };
            
            axios.post(this.state.base+'runner/createRun',fd,config).then((res)=>{
                this.setState({
                    loading:false
                })
                console.log(res.data);
                alert('Run has been scheduled successfully!')
                window.location.reload();
            }).catch(error => {
                this.setState({
                    loading:false
                })
                console.log("Error in scheduling new run: "+error)})
        }
    }

    render()
    {
        if(this.state.loading) return <Loader parent_val="Run is getting Scheduled."/>
        return(
            <div className="mainDiv">
                <div className="navDiv">
                    <Navbar />
                </div>

                <div className="bugDiv">
                    <h3>Schedule a new Test Run</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Projectname: </label>
                            <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.projectname}
                            onChange={this.onChangeProjectName}>
                            {   //opening of curly braces so as to enter js code and distinguish from JSX html code
                                this.state.projects.map((project)=>{
                                    //<option>value_to_be_displayed</option>
                                    return <option key={project} value={project}>{project}</option>
                                })
                                //closing of curly braces meaning our js code has finished
                            }   
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Run Name: </label>
                            <input type="text"
                                required
                                className="form-control"
                                value={this.state.runname}
                                onChange={this.onChangeRunName}></input>
                        </div>

                        <div className="form-group">
                            <label>Operating System for devices: </label>
                            <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.selectedOS}
                            onChange={this.onChangeOS}>
                            {   //opening of curly braces so as to enter js code and distinguish from JSX html code
                                this.state.OS.map((os)=>{
                                    //<option>value_to_be_displayed</option>
                                    return <option key={os} value={os}>{os}</option>
                                })
                                //closing of curly braces meaning our js code has finished
                            }   
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Mobile Devices</label>
                            <Select
                                isMulti
                                required
                                onChange={this.onChangeMultiSelect}
                                options={this.state.devices}
                                value={this.state.selectedDevices}
                            />
                            <p>
                                <input
                                    onChange={this.onChangeCheckbox}
                                    type="checkbox"
                                    id="selectAll"
                                    value="selectAll"
                                    checked={this.state.checked}
                                />
                                <label>Select all</label>
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Selected Device Pool Name: </label>
                            <input type="text"
                                required
                                className="form-control"
                                value={this.state.devicePoolName}
                                onChange={this.onChangeDevicePoolName}></input>
                        </div>

                        <div className="form-group">
                            <label>Type of test: </label>
                            <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.testType}
                            onChange={this.onChangeTestType}>
                            {   
                                this.state.testTypes.map((tt)=>{
                                    return <option key={tt} value={tt}>{tt}</option>
                                })
                            }
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Testing Files</label>
                            <Select
                                isMulti
                                required
                                onChange={this.onChangeMultiSelectTestFiles}
                                options={this.state.currentSetFileNames}
                                value={this.state.selectedSetFileNames}
                            />
                            <p>
                                <input
                                    onChange={this.onChangeTestFileSelectBox}
                                    type="checkbox"
                                    id="selectAll"
                                    value="selectAll"
                                    checked={this.state.testFileChecked}
                                />
                                <label>Select all</label>
                            </p>
                        </div>

                        <div className="form-group files">
                            <label>Upload Application (.apk/.isa) File </label>
                            <input type="file" 
                                    required
                                    className="form-control" 
                                    multiple=""
                                    onChange={this.onChangeAppFileUpload}></input>
                        </div>

                        <div className="form-group">
                            <input type="submit" value="Schedule Run" className="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateRun