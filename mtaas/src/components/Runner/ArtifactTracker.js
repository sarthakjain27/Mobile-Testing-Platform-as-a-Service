import React from 'react';
import Artifact from './Artifact'
import Navbar from '../Navbar/Navbar'
import './ArtifactTracker.css'
import axios from 'axios';

const GlobalVar = require("../../GlobalVar");
class ArtifactTracker extends React.Component{

    constructor(props)
    {
        super(props)
        this.state={
            runname:this.props.match.params.runname,
            deviceName:'',
            suiteName:'',
            testName:'',
            artifacts:[],
            base:GlobalVar.server_base_url
        }
        this.artifactList=this.artifactList.bind(this)
    }
    componentDidMount(){
        let data={rid:this.props.match.params.rid,jid:this.props.match.params.jid,sid:this.props.match.params.sid,tid:this.props.match.params.tid}
        axios.post(this.state.base+'runner/getArtifactsOfTestOfSuitesOfDeviceOfRun',data).then((response)=>{
            console.log(response.data)
            this.setState({
                artifacts:response.data.jobs[0].suites[0].tests[0].artifacts,
                deviceName:response.data.jobs[0].name,
                suiteName:response.data.jobs[0].suites[0].name,
                testName:response.data.jobs[0].suites[0].tests[0].name
            })
        })
    }

    artifactList()
    {
        return this.state.artifacts.map((eachArtifact)=>{
            //for each object in exercise we are returning an Exercise component and passing three props
            return <Artifact artifact={eachArtifact} />
        })
    }

    render(){
        return(
            <div className="mainDiv">
                <div className="navDiv">
                    <Navbar />
                </div>
                <div className="artifactListDiv">
                    <h1>Test Run: <i style={{ color: 'blue' }}>{this.state.runname}</i></h1>
                    <h2>Job Device: <i style={{ color: 'red' }}>{this.state.deviceName}</i></h2>
                    <h2>Suite: <i style={{ color: 'green' }}>{this.state.suiteName}</i></h2>
                    <h2>Test: <i style={{ color: 'coral' }}>{this.state.testName}</i></h2>
                </div>
                <div className="testListDiv">
                    <h2>Artifacts</h2>
                    <table className="table">
                        <thead className="thead-light" > 
                            <tr>
                                <th>Artifact_Name</th>
                                <th>Artifact_Type</th>
                                <th>Artifact_Extension</th>
                                <th>Download_Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.artifactList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ArtifactTracker