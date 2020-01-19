import React from 'react';
import { Tooltip } from 'reactstrap';

class Test extends React.Component{

    constructor(props)
    {
        super(props)
        this.state={
            tooltipOpen:false
        }
        this.onToggle=this.onToggle.bind(this);
    }
    onToggle(e)
    {
        this.setState({
            tooltipOpen:!this.state.tooltipOpen
        });
    }
    render(){
        let link='/artifactTracker/'+this.props.runID+'/'+this.props.jobID+'/'+this.props.sID + '/' + this.props.test._id + '/'+this.props.runName
        let action_component=<a href={link}> Test Details</a>
        let result_color='blue'
        if(this.props.test.result==='FAILED')
            result_color='red'
        else if(this.props.test.result==='ERRORED')
            result_color='orange'
        else if(this.props.test.result==='PASSED')
            result_color='green'
        else if(this.props.test.result==='STOPPED')
            result_color='coral'
        return(
            <tr>
                <td>{this.props.test.name}</td>
                <td>{this.props.test.status}</td>
                <td style={{color:result_color}}>{this.props.test.result}</td>
                <td style={{ color: 'blue' }}>{this.props.test.counters.total}</td>
                <td style={{ color: 'green' }}>{this.props.test.counters.passed}</td>
                <td style={{ color: 'red' }}>{this.props.test.counters.failed}</td>
                <td style={{ color: 'orange' }}>{this.props.test.counters.errored}</td>
                <td>{this.props.test.counters.total - this.props.test.counters.passed - this.props.test.counters.failed - this.props.test.counters.errored}</td>
                <td style={{color:result_color}}>{this.props.test.message}</td>
                <td>{this.props.test.deviceMinutes.total}</td>
                <td>{action_component}</td>
            </tr>
        )
    }
}

export default Test