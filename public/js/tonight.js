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
            count: 0,
            detailsState: "details-div-hidden"

        }
    }

    componentDidMount(){
        socket.on('new state', function(newState) {
            this.setState(newState);
        }.bind(this));
    }

/*NETWORK Sync*/
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
/*End NETWORK Sync*/




  _countClicker(e) {
    this.networkSetState({ count: (this.state.count + 1) });
    console.log(this.state.count);
  }
  

    render(){
        return(
            <div className="places-container">
                <div className="input-group">
                    <button className="btn btn-primary form-control" 
                        onClick={()=> this._countClicker() }
                    >Click Me!</button>
                    <span className="input-group-addon counter" id="btnGroupAddon">{this.state.count}</span>
                </div>

            </div>
        )
    }


}
/*
ReactDOM.render(
    <PlacesContainerComponent />, document.getElementById("mount-point")
)

ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)
*/