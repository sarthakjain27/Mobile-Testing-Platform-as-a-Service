import React from 'react';
import Navbar from "../Navbar/Navbar";
import './Loader.css'

class ShowDetail extends React.Component {
  constructor(props)
  {
    super(props)
  }
  render(){
    return (
      <div className="mainDiv">
          <div className="navDiv">
                <Navbar />
          </div>
          <div className="loaderDiv">
              <h3>{this.props.parent_val} Please do not refresh the page and don't go back!</h3> 
              <i className="fa fa-cog fa-spin" style={{ fontSize: '25em' }}/>
          </div>
      </div>
    );
  }
}

export default ShowDetail;
