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
        var placeName = jQuery.urlParam('location') || "";
        console.log(placeName == "");


        //User
        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                //console.log(user);
                //if (placeName != ""){
                //    user.defaultLocation = placeName;
                //    this.setState({ searchLocation: (user.defaultLocation  )});
                //}
                //if (user.defaultLocation != ""){
                this.setState({ searchLocation: (user.defaultLocation || "My Search Location" )});
                //}
                this.setState({ user: user });

                console.log(this.state);
            }
        });
    }

    _searchLocation(){
        //window.location = this.searchBar.value
        console.log(this.searchBar.value);
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
            <form id="search" className="col s12" action="/" method="get">
                {searchBar}
                <span className="input-group-btn col s3">
                    <button type="submit" className="btn btn-block btn-primary" > <i className="material-icons">search</i>  </button>
                </span>
            </form>
        </div>
    )}

}

ReactDOM.render (
    <SearchBar />, document.getElementById('search-bar')
)
