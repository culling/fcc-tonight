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

            var date   = new Date();



        var place = Object.assign(this.state.place);
        place.guests = this.state.guests.map((guest) => {return guest});
        place.guests.push({username: this.props.user.username, date: date.shortDate()}); //this.state[`${this.props.place.place_id}`];
        //console.log(place);
        
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


    var guests = this.state.guests.map((guest) => {return guest});
    var date   = new Date();



    guests.push({username: this.props.user.username, date: date.shortDate() }); //this.state[`${this.props.place.place_id}`];
    console.log(guests);
    this.networkSetState({guests:guests});

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