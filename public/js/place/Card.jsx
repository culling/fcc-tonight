// https://simonsmith.io/writing-react-components-as-commonjs-modules/

console.log("Card Loaded");

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

Date.prototype.shortDate = function() {
return this.getUTCFullYear() +
    '-' + pad(this.getUTCMonth() + 1) +
    '-' + pad(this.getUTCDate())
};



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
        jQuery.ajax({
            method: 'GET',
            url:("/api/guestList/"+ this.props.place.place_id),
            contentType: 'application/json', // for request
            //dataType: 'json',
            success: (results)=>{

                let guestList = JSON.parse(results) ;
                if (guestList != null){

                    this.setState({guests: (guestList.guestList.guests || [] )});
                    //console.log(this.state.guests);
                }
            }
        });

        socket.on('new state', function(newState) {
            console.log(newState);
            this.setState(newState);
        }.bind(this));
    }

    //NETWORK Sync
    networkSetState(newStateDiff) {
        // do some awesome network things here
        // 1. put the entire state into the database
        this.saveStateToDB(newStateDiff);
        // 2. put diffs onto the websocket
        this.postToSocket(newStateDiff);
        // 3. set state as per usual
        this.setState(newStateDiff);
    }

    postToSocket(newStateDiff) {
        socket.emit('new state', newStateDiff);
    }

    saveStateToDB(guestList) {
        //console.log(guestList);
        var date   = new Date();

        var place = Object.assign(this.state.place);
        place.guests = guestList.guests;
        //console.log(place);

        jQuery.ajax({ url: '/api/guestList', 
            contentType: 'application/json', // for request
            dataType: 'json', //for response
            type: 'PUT',
            data: JSON.stringify(place) 
        });

    }



    //End NETWORK Sync




  _addToGuestList(e) {
    var username = this.props.user.username;
    var guests = this.state.guests.map((guest) => {return guest});

    var date   = new Date();
    var newGuest = {username: username, date: date.shortDate() };

    var guestFound = guests.filter((existingGuest)=>{
        return existingGuest.username == newGuest.username;
    });

//    console.log(guestFound);
    if(guestFound.length == 0){
        guests.push(newGuest); //this.state[`${this.props.place.place_id}`];
//        console.log(guests);
        this.networkSetState({guests:guests});
    }

  }
  
  _removeFromGuestList(event){
    var username = this.props.user.username;
    var guests = this.state.guests.map((guest) => {return guest});

    var filteredGuests = guests.filter((existingGuest)=>{
        return existingGuest.username != username;
    });

    console.log(filteredGuests);
    this.networkSetState({guests:filteredGuests});

  }



    render(){
        return(

            <div className="col s12 m6" >
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">{this.props.place.name}</span>

                        { this.state.guests &&
                            <div>Guests for this Place: {this.state.guests.length}
                                <p> Current Guest List</p>
                                
                                <ul className="collection">
                                    {this.state.guests.map((guest, i) => {
                                        return <li key={i} className="collection-item avatar" style={{color: "black"}}>
                                            <i className="material-icons circle red" style={{ fontSize:"2em" }} >{ String(guest.username).toString().toUpperCase() }</i><p>{guest.username} - {guest.date } </p>
                                            </li>})}
                                </ul>
                            </div>
                            
                        }
                        {(this.props.user.type == "user") &&
                        <div className="card-action">
                            <a href="#" onClick={()=> this._addToGuestList() }>Going Tonight</a>
                            <a href="#" onClick={()=> this._removeFromGuestList()}>Not Going Tonight</a>
                        </div>
                        }
                    </div>
                </div>
            </div>



        )
    }


}