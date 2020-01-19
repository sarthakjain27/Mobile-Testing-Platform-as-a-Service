import React from 'react';
import axios from 'axios';
import Run from './Run';
import Navbar from '../Navbar/Navbar'
import './RunTracker.css'
import Loader from "./Loader";

const GlobalVar = require('../../GlobalVar');

class RunTracker extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            base:GlobalVar.server_base_url,
            runs:[],
            username:'',
            projects:[],
            projectname:'',
            username:'',
            loading:false,
        }
        //this.stopRun=this.stopRun.bind(this);
        this.onChangeProjectName=this.onChangeProjectName.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.getUpdate=this.getUpdate.bind(this);
        this.stopARun=this.stopARun.bind(this);
    }

    componentDidMount(){
        this.setState({
            username:localStorage.getItem('email')
        })
        let data={username:localStorage.getItem('email')}

        if(localStorage.getItem('cookie')==='Admin')
        {
            axios.post(this.state.base+'getAllProjectsForTester',data).then((response)=>{
                if(response.data.length > 0)
                {
                    let projectName=[]
                    response.data.forEach((eachProject)=>{
                        projectName.push(eachProject.projectname)
                    })
                    this.setState({
                        projects:projectName,
                        projectname:projectName[0]
                    })
                }
            }).catch((err)=>{
                console.log("Unable to fetch user details: "+err);
            })
        }
        else
        {
            axios.post(this.state.base+'users/oneUser',data).then((response)=>{
                //response.data returns an array of objects containing our documents in the database
                //to show only the projects the tester is added in
                if(response.data.project_involved.length > 0)
                {
                    let temp=response.data.project_involved
                    //temp.push('ALL')
                    this.setState({
                        projects:temp,
                        projectname:response.data.project_involved[0]
                    })
                }
            }).catch((err)=>{
                console.log("Unable to fetch user details: "+err);
            })
        }
    }

    onChangeProjectName(e)
    {
        console.log('Project selected: '+e.target.value)
        this.setState({
            projectname:e.target.value
        });
    }

    getUpdate(rarn)
    {
        this.setState({
            loading:true
        })
        console.log('Inside getUpdate')
        let data={RUN_ARN:rarn}
        console.log(data)
        axios.post(this.state.base+'runner/getRunUpdate',data).then((response)=>{
            this.setState({
                loading:false
            })
            console.log(response.data)
            let d={username:this.state.username,projectname:this.state.projectname}
            axios.post(this.state.base+'runner/oneProjectAllRunsTester',d).then((response)=>{
                this.setState({
                    runs:response.data
                },()=>{
                    this.runList()
                })
            }).catch(err=>console.log("Error in oneProjectAllRunsTester inside getUpdate(): "+err));
        }).catch(err=>{
            this.setState({
                loading:false
            })
            console.log("Error in getUpdate(): "+err)
        })
    }

    stopARun(rarn)
    {
        this.setState({
            loading:true
        })
        console.log('Inside getUpdate')
        let data={RUN_ARN:rarn}
        console.log(data)
        axios.post(this.state.base+'runner/stopRun',data).then((response)=>{
            this.setState({
                loading:false
            })
            console.log(response.data)
            this.getUpdate(rarn)
        }).catch(err=>{
            this.setState({
                loading:false
            })
            console.log("Error in stopRun(): "+err)
        })
    }

    runList(){
        return this.state.runs.map((eachRun)=>{
            //for each object in exercise we are returning an Exercise component and passing three props
            return <Run run={eachRun} updateRun={this.getUpdate} stopRun={this.stopARun} key={eachRun._id}/>
        })
    }

    onSubmit(e)
    {
        e.preventDefault();
        if(localStorage.getItem('cookie')==='Tester')
        {
            let data={username:this.state.username,projectname:this.state.projectname}
            axios.post(this.state.base+'runner/oneProjectAllRunsTester',data).then((response)=>{
                this.setState({
                    runs:response.data
                })
            }).catch(err=>console.log("Error: "+err));
        }
    }

    render(){
        if(this.state.loading) return <Loader parent_val="Run Status is getting Updated....."/>
        return(
            <div className="mainDiv">
                <div className="navDiv">
                    <Navbar />
                </div>

                <div className="runDiv">
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
                        <div className="text-center">
                            <input type="submit" value="Get Runs" className="btn btn-primary" />
                        </div>
                    </form>
                </div>

                <div className="runListDiv">
                    <h3>Logged Runs</h3>
                    <table className="table">
                        <thead className="thead-light" > 
                            <tr>
                                <th>User</th>
                                <th>Project</th>
                                <th>RunName</th>
                                <th>TestType</th>
                                <th>Platform</th>
                                <th>RunStatus</th>
                                <th>RunResult</th>
                                <th>Total Jobs</th>
                                <th>Passed Jobs</th>
                                <th>Failed Jobs</th>
                                <th>Errored Jobs</th>
                                <th>Other Jobs</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.runList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default RunTracker