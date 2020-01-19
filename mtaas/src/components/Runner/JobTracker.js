import React from 'react';
import Job from './Job'
import Navbar from '../Navbar/Navbar'
import './JobTracker.css'
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';

const GlobalVar = require("../../GlobalVar");

class JobTracker extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            runname:'',
            rid:this.props.match.params.id,
            devices:[],
            base:GlobalVar.server_base_url,
            data:{}
        }
        this.jobList=this.jobList.bind(this)
    }

    componentDidMount(){
        let data={id:this.props.match.params.id}
        axios.post(this.state.base+'runner/getSingleRun',data).then((response)=>{
            let ld=["Passed","Failed","Warned","Errored","Stopped","Skipped"]
            let bc=['#76ba1b','#ff0000','#ffff00','#ffa500','#0000ff','#00ffff']
            let dd=[]
            dd.push(response.data.counters.passed)
            dd.push(response.data.counters.failed)
            dd.push(response.data.counters.warned)
            dd.push(response.data.counters.errored)
            dd.push(response.data.counters.stopped)
            dd.push(response.data.counters.skipped)
            this.setState({
                runname:response.data.name,
                devices:response.data.jobs,
                data:{
                    labels:ld,
                    datasets:[{
                        data:dd,
                        backgroundColor:bc,
                        hoverBackgroundColor:bc
                    }]
                }
            })
        })
    }

    jobList(){
        return this.state.devices.map((eachDevice)=>{
            console.log(eachDevice)
            //for each object in exercise we are returning an Exercise component and passing three props
            return <Job job={eachDevice} runID={this.state.rid} runName={this.state.runname}/>
        })
    }

    render(){
        return(
            <div className="mainDiv">
                <div className="navDiv">
                    <Navbar />
                </div>
                <div className="jobListDiv">
                    <h1>Test Run: <i style={{ color: 'blue' }}>{this.state.runname}</i></h1>
                </div>
                <div className="listDiv">
                    <Doughnut data={this.state.data} 
                            width={100}
                            height={20}
                            options={{ maintainAspectRatio: true }} />
                </div>
                <div className="jobListDiv">
                    <h3>Devices</h3>
                    <table className="table">
                        <thead className="thead-light" > 
                            <tr>
                                <th>MobileDevice</th>
                                <th>OS_Version</th>
                                <th>No._of_Total Suites</th>
                                <th>No._of_Passed Suites</th>
                                <th>No._of_Failed Suites</th>
                                <th>No._of_Errored Suites</th>
                                <th>No._of_Other Suites</th>
                                <th>Message</th>
                                <th>Total_Device_Minutes</th>
                                <th>Available_Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.jobList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default JobTracker