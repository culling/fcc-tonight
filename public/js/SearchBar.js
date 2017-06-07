$('document').ready(function() {
    console.log("javascript Loaded");

});



class SearchBar extends React.Component{
    constructor(){
        super();
        this.state={
            user: undefined,
            searchLocation: "My Search Location"
            
        }
        this.defaultSearchLocation = "My Search Location";
    }

    componentWillMount(){
        jQuery.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
            return null;
            }
            else{
            return decodeURI(results[1]) || 0;
            }
        }
        var placeName = jQuery.urlParam('location') //|| this.defaultSearchLocation;
        //console.log(placeName);
        //this.setState({searchLocation: placeName});


        //User
        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                this.setState({ searchLocation: (user.defaultLocation || placeName || this.defaultSearchLocation )});
                //}
                this.setState({ user: user });

                console.log(this.state);
            }
        });
    }

    _formSubmit(event){
        //Set the value before submission unless it is the default text;
        var location = jQuery("#location").val();
        if (location == ""){
            if (this.state.searchLocation != this.defaultSearchLocation){
                jQuery("#location").val(this.state.searchLocation);
            }else{
                event.preventDefault();
            }
        }
    }

    render(){
        //if (this.state.user){
        //    var searchBar = <input className="col s9" placeholder={this.state.searchLocation} defaultValue={this.state.searchLocation || ""} name="location" type="text" ></input>
        //}
        //else{

        

        var searchBar = <input ref={(input)=> this.location = input} id="location" 
            className="col s9" placeholder={this.state.searchLocation} 
            defaultValue={""} name="location" type="text" ></input>            
        //}

        return (
        <div className="row">
            <form id="search" className="col s12" action="/" method="get" onSubmit={this._formSubmit.bind(this) }  >
                {searchBar}
                <span className="input-group-btn col s3">
                    <button type="submit" className="btn btn-block btn-primary"  > <i className="material-icons">search</i>  </button>
                </span>
            </form>
        </div>
    )}

}

ReactDOM.render (
    <SearchBar />, document.getElementById('search-bar')
)
