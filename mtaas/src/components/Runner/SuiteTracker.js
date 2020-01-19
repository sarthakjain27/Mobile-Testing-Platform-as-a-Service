import React from 'react';
import Suite from './Suite'
import Navbar from '../Navbar/Navbar'
import './SuiteTracker.css'
import axios from 'axios';

const GlobalVar = require("../../GlobalVar");
class SuiteTracker extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            runname:this.props.match.params.runname,
            deviceName:'',
            suites:[],
            base:GlobalVar.server_base_url
        }
        this.suiteList=this.suiteList.bind(this)
    }

    componentDidMount(){
        let data={rid:this.props.match.params.rid,jid:this.props.match.params.jid}
        axios.post(this.state.base+'runner/getSuitesOfDeviceOfRun',data).then((response)=>{
            //console.log(response.data)
            this.setState({
                suites:response.data.jobs[0].suites,
                deviceName:response.data.jobs[0].name
            })
        })
    }
    
    suiteList()
    {
        return this.state.suites.map((eachSuite)=>{
            //for each object in exercise we are returning an Exercise component and passing three props
            return <Suite suite={eachSuite} runID={this.props.match.params.rid} jobID={this.props.match.params.jid} runName={this.props.match.params.runname} />
        })
    }

    render(){
        return(
            <div className="mainDiv">
                <div className="navDiv">
                    <Navbar />
                </div>
                <div className="suiteListDiv">
                    <h1>Test Run: <i style={{ color: 'blue' }}>{this.state.runname}</i></h1>
                    <h2>Job Device: <i style={{ color: 'red' }}>{this.state.deviceName}</i></h2>
                </div>
                <div className="suiteListDiv">
                    <h2>Suites</h2>
                    <table className="table">
                        <thead className="thead-light" > 
                            <tr>
                                <th>Suite Name</th>
                                <th>Status</th>
                                <th>Result</th>
                                <th>Total Tests</th>
                                <th>Passed Tests</th>
                                <th>Failed Tests</th>
                                <th>Errored Tests</th>
                                <th>Other Tests</th>
                                <th>Message</th>
                                <th>Total_Device_Minutes</th>
                                <th>Available_Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.suiteList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default SuiteTracker