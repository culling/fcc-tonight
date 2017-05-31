$('document').ready(function() {
    console.log("tonight.js loaded");
    
});


class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    componentDidMount() {
        // grab state from the server
        $.ajax({ url: '/api/message' })
            .then(function(data) {
            this.setState(data);
            }.bind(this))
        // listen for state changes on the socket
        socket.on('new state', function(newState) {
            this.setState(newState);
        }.bind(this));
    }

/*
  _handleChangeMessage(e) {
    this.setState({ message: e.target.value });
    console.log(this.state.message);
  }
*/

  _handleChangeMessage(e) {
    this.networkSetState({ message: e.target.value });
    console.log(this.state.message);
  }
  
    networkSetState(newStateDiff) {
        // do some awesome network things here
        // 1. put the entire state into the database
        this.saveStateToDB();
        // 2. put diffs onto the websocket
        this.postToSocket(newStateDiff);
        // 3. set state as per usual
        this.setState(newStateDiff);
    }


    postToSocket(newStateDiff) {
    socket.emit('new state', newStateDiff);
    }

    saveStateToDB() {
    $.ajax({ url: '/api/message', type: 'PUT', data: this.state });
    }


  render() {
    return (
    <div><h1> React is Go! </h1> 
        <input type="text" value={this.state.message} onChange={this._handleChangeMessage.bind(this)} />
    </div>
    )
  }
};



class PlacesContainerComponent extends React.Component{
    constructor(){
        super();
        this.state={
            polls: [],
            detailsState: "details-div-hidden"

        }
    }

}


ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)