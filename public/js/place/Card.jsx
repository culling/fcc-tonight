// https://simonsmith.io/writing-react-components-as-commonjs-modules/

console.log("Card Loaded");




class Card extends React.Component{
    constructor(props){
        super(props);
        //var [placeId] = this.props.place.place_id;
        this.state={
            count: 0,
            detailsState: "details-div-hidden",
            [`${this.props.place.place_id}`]:0,
            place: this.props.place, 
            guests:[]
        }
        //console.log(this.state);
    }

    componentWillMount(){
        //console.log("Card Mounted");
        //console.log(this.props.place);
        //function getGuestList(place_id){
            jQuery.ajax({
                method: 'GET',
                url:("/api/guestList/"+ this.props.place.place_id),
                contentType: 'application/json', // for request
                //dataType: 'json',
                success: (results)=>{
                    //if(results[0].length != undefined){
                    let guestList = JSON.parse(results) ;
                    if (guestList != null){
                        /*
                        console.log("results: " + results);
                        console.log("guestList: ")
                        console.log(guestList.guestList);
                        console.log("guests: ")
                        console.log(guestList.guestList.guests);
                        */
                        this.setState({guests: (guestList.guestList.guests || [] )});
                        
                    }
                }
            });
        //}



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
        
        var place = Object.assign(this.state.place);
        place.guests = this.state.guests.map((guest) => {return guest});
        place.guests.push(this.props.user.username); //this.state[`${this.props.place.place_id}`];
        console.log(place);
        
        //console.log(this.state.guests);

        jQuery.ajax({ url: '/api/guestList', 
            contentType: 'application/json', // for request
            dataType: 'json', //for response
            type: 'PUT',
            data: JSON.stringify(place) 
        });

    }



    //End NETWORK Sync




  _countClicker(e) {
    //let placeId = this.props.place.place_id;
    //this.networkSetState({ [`${this.props.place.place_id}`]: (this.state[`${this.props.place.place_id}`]+ 1 ) });

    //var place = Object.assign(this.state.place);
        var guests = this.state.guests.map((guest) => {return guest});
        guests.push(this.props.user.username); //this.state[`${this.props.place.place_id}`];
        console.log(guests);
    this.networkSetState({guests:guests});
    //this.networkSetState({ count:   (this.state.count  + 1) });
    //console.log(this.state.count);
    //console.log(this.state);
  }
  

    render(){
        return(

            <div className="col s12 m6" >
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">{this.props.place.name}</span>
                        <div>Clicks: {this.state.count}</div>
                        {/*<div>Clicks for this Place: {this.state[`${this.props.place.place_id}`] }</div>*/}
                        { this.state.guests &&
                            <div>Guests for this Place: {this.state.guests.length}</div>
                        }
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