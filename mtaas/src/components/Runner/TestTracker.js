import React from 'react';
import Test from './Test'
import Navbar from '../Navbar/Navbar'
import './TestTracker.css'
import axios from 'axios';

const GlobalVar = require("../../GlobalVar");
class TestTracker extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            runname:this.props.match.params.runname,
            devicename:'',
            suitename:'',
            tests:[],
            base:GlobalVar.server_base_url
        }
        this.testList=this.testList.bind(this)
    }
    componentDidMount(){
        let data={rid:this.props.match.params.rid,jid:this.props.match.params.jid,sid:this.props.match.params.sid}
        axios.post(this.state.base+'runner/getTestsOfSuitesOfDeviceOfRun',data).then((response)=>{
            console.log(response.data)
            this.setState({
                tests:response.data.jobs[0].suites[0].tests,
                devicename:response.data.jobs[0].name,
                suitename:response.data.jobs[0].suites[0].name
            })
        })
    }

    testList()
    {
        return this.state.tests.map((eachTest)=>{
            //for each object in exercise we are returning an Exercise component and passing three props
            return <Test test={eachTest} runID={this.props.match.params.rid} jobID={this.props.match.params.jid} sID={this.props.match.params.sid} runName={this.props.match.params.runname}/>
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
                    <h2>Job Device: <i style={{ color: 'red' }}>{this.state.devicename}</i></h2>
                    <h2>Suite: <i style={{ color: 'green' }}>{this.state.suitename}</i></h2>
                </div>
                <div className="testListDiv">
                    <h2>Tests</h2>
                    <table className="table">
                        <thead className="thead-light" > 
                            <tr>
                                <th>Test_Name</th>
                                <th>Status</th>
                                <th>Result</th>
                                <th>Total_Tests</th>
                                <th>Passed_Tests</th>
                                <th>Failed_Tests</th>
                                <th>Errored_Tests</th>
                                <th>Other_Tests</th>
                                <th>Message</th>
                                <th>Total_Device_Minutes</th>
                                <th>Available_Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.testList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default TestTracker