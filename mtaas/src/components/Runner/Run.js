import React from 'react';
import { Tooltip } from 'reactstrap';

class Run extends React.Component{
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
        let action_component;
        let link="/jobTracker/"+this.props.run._id
        if(localStorage.getItem('cookie')==='Tester')
        {
            action_component=
                <td>
                    <a href="#" onClick={()=>{this.props.updateRun(this.props.run.arn)}}> Update</a>
                    <a href={link}> RunDetails</a>
                </td>
            if(this.props.run.status!=='COMPLETED' && this.props.run.status!=='STOPPING')
            {
                action_component=
                <td>
                    <a href="#" onClick={()=>{this.props.updateRun(this.props.run.arn)}}> Update</a>
                    <a href={link}> RunDetails</a>
                    <a href="#" style={{ color: '#DC143C' }} onClick={()=>{this.props.stopRun(this.props.run.arn)}}> Stop</a>
                </td>
            }
        }
        return(
            <tr>
                <td>{this.props.run.userName}</td>
                <td>{this.props.run.projectName}</td>
                <td>{this.props.run.name}</td>
                <td>{this.props.run.type}</td>
                <td>{this.props.run.platform}</td>
                <td>{this.props.run.status}</td>
                <td>{this.props.run.result}</td>
                <td>{this.props.run.counters.total}</td>
                <td>{this.props.run.counters.passed}</td>
                <td>{this.props.run.counters.failed}</td>
                <td>{this.props.run.counters.errored}</td>
                <td>{this.props.run.counters.total - this.props.run.counters.passed - this.props.run.counters.failed - this.props.run.counters.errored}</td>
                <td>{action_component}</td>
            </tr>
        )
    }
}

export default Run