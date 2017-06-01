// https://simonsmith.io/writing-react-components-as-commonjs-modules/

console.log("PlaceContainer.jsx Loaded");



class PlaceContainer extends React.Component{
    constructor(){
        super();
        this.state={
            count: 0,
            detailsState: "details-div-hidden",
            places:[]
        }
    }

    componentWillMount(){
        var placeName = "Floreat"
        jQuery.ajax({
            method: 'GET',
            url:("/api/places/"+ placeName),
            success: (result)=>{
                //this.setState({detailsState: "details-div-visible"});
                var places = [];
                places.push(result);


                //console.log(places)
                this.setState({places: places });


                //this.forceUpdate();
            }
        });
               
    }
    

    render(){
        return (
            <div className="place-container">

                
                {/*(this.state.places.length == 0) &&*/}
                    <div>
                        No Places Found!
                        <Card place={{"name": "Test"}} />
                        <Card place={{"name": "Test"}} />
                    </div>

                {
                    this.state.places.map( (myPlace, i) => 
                        <Card key={i} place={myPlace} />
                ) }
                

                
            </div>
        )
    };
}



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
        //console.log( this.props.place );
        var place = this.props.place;
        console.log(  place  );

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


ReactDOM.render (
    <PlaceContainer />, document.getElementById('place-container')
)
