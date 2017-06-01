// https://simonsmith.io/writing-react-components-as-commonjs-modules/

console.log("Card Loaded");




class Card extends React.Component{
    constructor(){
        super();
        this.state={
            count: 0,
            detailsState: "details-div-hidden"

        }
    }

    componentWillMount(){
        console.log("Card Mounted");
        console.log(this.props.place);


        socket.on('new state', function(newState) {
            this.setState(newState);
        }.bind(this));
    }

    //NETWORK Sync
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
        jQuery.ajax({ url: '/api/message', type: 'PUT', data: this.state });
    }
    //End NETWORK Sync




  _countClicker(e) {
    this.networkSetState({ count: (this.state.count + 1) });
    console.log(this.state.count);
  }
  

    render(){
        return(
        
            <div className="col s12 m6">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">{this.props.place.name}</span>
                        Clicks: {this.state.count}
                        <div className="card-action">
                            <a href="#" onClick={()=> this._countClicker() }>Count Clicker</a>
                            <a href="#">This is a link</a>
                        </div>
                    </div>
                </div>
            </div>
        


        )
    }


}