import React, { Component } from 'react'
import styled from 'styled-components';

//this componet will have event listener
const Wrapper = styled.div`
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    text-align:center;
`;

class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.clearSearchBox = this.clearSearchBox.bind(this);
    }

    componentDidMount({map, mapApi} = this.props){
        const options = {
            types: ['address'],
        };
        this.autoComplete = new mapApi.places.Autocomplete(
            this.searchInput,
            options,
        );
        this.autoComplete.addListener('place_changed', this.onPlaceChanged);
        this.autoComplete.bindTo('bounds', map);
    }

    componentWillUnmount({mapApi} = this.props){
        mapApi.event.clearInstanceListeners(this.searchInput);
    }

    onPlaceChanged = ({ map, addplace } = this.props) => {
        const place = this.autoComplete.getPlace();
        if (!place.geometry) return;
        if (place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        addplace(place);
        this.searchInput.blur();
    };

    clearSearchBox() {
        this.searchInput.value = '';
    }

    render() {
        return (
            <Wrapper>
                <input
                    className="search-input"
                    ref = { (ref) => {
                        this.searchInput = ref;
                    } }
                    type="text"
                    onFocus={this.clearSearchBox}
                    placeholder="Enter location to search"
                />
            </Wrapper>
        )
    }
}

export default Autocomplete
