import React from 'react';
import { Tooltip } from 'reactstrap';

class Suite extends React.Component{

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
        let link='/testTracker/'+this.props.runID+'/'+this.props.jobID+'/'+this.props.suite._id + '/'+this.props.runName
        let action_component=<a href={link}> Suite Details</a>
        let result_color='blue'
        if(this.props.suite.result==='FAILED')
            result_color='red'
        else if(this.props.suite.result==='ERRORED')
            result_color='orange'
        else if(this.props.suite.result==='PASSED')
            result_color='green'
        else if(this.props.suite.result==='STOPPED')
            result_color='coral'
        return(
            <tr>
                <td>{this.props.suite.name}</td>
                <td>{this.props.suite.status}</td>
                <td style={{color:result_color}}>{this.props.suite.result}</td>
                <td style={{ color: 'blue' }}>{this.props.suite.counters.total}</td>
                <td style={{ color: 'green' }}>{this.props.suite.counters.passed}</td>
                <td style={{ color: 'red' }}>{this.props.suite.counters.failed}</td>
                <td style={{ color: 'orange' }}>{this.props.suite.counters.errored}</td>
                <td>{this.props.suite.counters.total - this.props.suite.counters.passed - this.props.suite.counters.failed - this.props.suite.counters.errored}</td>
                <td style={{color:result_color}}>{this.props.suite.message}</td>
                <td>{this.props.suite.deviceMinutes.total}</td>
                <td>{action_component}</td>
            </tr>
        )
    }
}

export default Suite