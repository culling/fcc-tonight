$('document').ready(function() {
    console.log("javascript Loaded");
});



class SearchBar extends React.Component{
    constructor(){
        super();
        this.state={
            user: undefined,
            searchLocation: "My Search Place"
        }
    }

    componentWillMount(){
        //User
        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                console.log(user);
                this.setState({ searchLocation: (user.defaultLocation || "My Search Place" )});
                this.setState({ user: user });
            }
        });
    }

    _searchLocation(){
        //window.location = this.searchBar.value
        console.log(this.searchBar.value);
    }

    render(){
        let searchbar = null;
        if (this.state.searchLocation){
            searchbar =
            <div>
                <input className="col s9" defaultValue={this.state.searchLocation} placeholder={this.state.searchLocation} name="location" type="text" ></input>

            </div>
        }else{
            searchbar = 
            <div>
                <input className="col s9" placeholder={"My Search Place"} name="location" type="text" ></input>
            </div>
        }

        return (
        <div className="row">
            <form className="col s12" action="/" method="get">
                {searchbar}
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
