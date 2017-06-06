$('document').ready(function() {
    console.log("javascript Loaded");
});



class SearchBar extends React.Component{
    constructor(){
        super();
        this.state={
            user: undefined
        }
    }

    componentWillMount(){
        //User
        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                this.setState({ user: user })
            }
        });
    }

    _searchLocation(){
        //window.location = this.searchBar.value
        console.log(this.searchBar.value);
    }

    render(){
        let searchbar = null;
        if (this.state.lastSearch){
            searchbar =
            <div>
                <input placeholder={"My Search Place"} id="search_place" type="text" ref={(input)=> this.searchBar = input} ></input>
                <span className="input-group-btn">
                    <button className="btn btn-block btn-primary" onClick={ this._searchLocation.bind(this)}>Search</button>
                </span>

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
