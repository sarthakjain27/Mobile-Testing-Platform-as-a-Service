import React from 'react';
import { Tooltip } from 'reactstrap';

class Job extends React.Component{

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
        
        let link='/suiteTracker/'+this.props.runID+'/'+this.props.job._id+'/'+this.props.runName
        let action_component=<a href={link}> Job Details</a>
        let result_color='blue'
        if(this.props.job.result==='FAILED')
            result_color='red'
        else if(this.props.job.result==='ERRORED')
            result_color='orange'
        else if(this.props.job.result==='PASSED')
            result_color='green'
        else if(this.props.job.result==='STOPPED')
            result_color='coral'
        return(
            <tr>
                <td>{this.props.job.name}</td>
                <td>{this.props.job.deviceOS}</td>
                <td style={{ color: 'blue' }}>{this.props.job.counters.total}</td>
                <td style={{ color: 'green' }}>{this.props.job.counters.passed}</td>
                <td style={{ color: 'red' }}>{this.props.job.counters.failed}</td>
                <td style={{ color: 'orange' }}>{this.props.job.counters.errored}</td>
                <td>{this.props.job.counters.total - this.props.job.counters.passed - this.props.job.counters.failed - this.props.job.counters.errored}</td>
                <td style={{color:result_color}}>{this.props.job.message}</td>
                <td>{this.props.job.deviceMinutes.total}</td>
                <td>{action_component}</td>
            </tr>
        )
    }
}

export default Job