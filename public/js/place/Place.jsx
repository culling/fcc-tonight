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
        var placeName = "Perth"
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
    

    render(){
        return (
            <div className="place-container">

                
                {/*(this.state.places.length == 0) &&*/}
                    <div>
                        No Places Found!
                        <Card place={{"name": "Test"}} />
                    </div>

                {
                    this.state.places.map( (place, i) => 
                    <div>
                        <Card key={i} place={place} />
                    </div>
                ) }
                

            </div>
        )
    };
}



ReactDOM.render (
    <PlaceContainer />, document.getElementById('place-container')
)
