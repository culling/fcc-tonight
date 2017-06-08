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

        //Place
        //var placeName = "Perth"

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
        this.setState({searchPlace:placeName});

        if (placeName){
            jQuery.ajax({
                method: 'GET',
                url:("/api/places/"+ placeName),
                success: (rawResult)=>{
                    this.setState({detailsState: "details-div-visible"});

                    var places = [];
                    var resultObject = JSON.parse(rawResult);

                    for(var i = 0; i< resultObject.length; i++){
                        places.push(resultObject[i]);
                    }

                    this.setState({places: places });

                }
            });

        }


        //User
        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                this.setState({ user: user })
            }
        });

    }
    

    render(){
        return (
            <div className="place-container row">

                    {
                        this.state.places.map( (place, i) => 
                        <Card key={i} place={place} user={this.state.user} />
                    ) }


                
                {(this.state.places.length == 0) &&
                <div>
                    {(this.state.searchPlace != "") &&
                        <div>
                            No results found
                        </div>
                    }
                </div>
                }
            </div>
        )
    };
}



ReactDOM.render (
    <PlaceContainer />, document.getElementById('place-container')
)
