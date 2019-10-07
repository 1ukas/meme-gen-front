import React from 'react';

const AlertBox = (props) => {
    return (
      <div className="alert-window alert alert-danger alert-dismissible fade show" role="alert">
        <h4>You should type something in :)</h4>
        <button type="button" className="close  align-middle" data-dismiss="alert" aria-label="Close" onClick={props.onHideAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
}
export default AlertBox;