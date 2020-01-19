import React from 'react';
import { Tooltip } from 'reactstrap';

class Artifact extends React.Component{

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
        let action_component=
            <a href={this.props.artifact.url}>Download File</a>
        return(
            <tr>
                <td>{this.props.artifact.name}</td>
                <td>{this.props.artifact.type}</td>
                <td>{this.props.artifact.extension}</td>
                <td>{action_component}</td>
            </tr>
        )
    }
}

export default Artifact