import React, { Component } from 'react'
import { observer } from "mobx-react"
import { distributorDetailStore } from "./distributorDetailStore";
import myDistributorDetailParam from "./components/myDistributorDetailParam";
import { Button } from 'antd'
import About from "./components/About";
import { callApi } from '../../../utils/callAPI';
// import { notify } from './../../common/notify/NotifyService';

@observer
class distributorDetail extends Component<any> {
    myRef: any;
    constructor(props: any) {
        super(props)
        this.myRef = React.createRef()   // Create a ref object 
    }
    componentDidMount() {
        this.myRef.current.scrollTo(0, this.myRef.current.offsetTop);
        this.requestAPI();
        distributorDetailStore.showAbout = true;
        
    }
    requestAPI = async () => {
        distributorDetailStore.loading = true;
        if (this.props.location.search) {
            const params = new myDistributorDetailParam(this.props.location.search)
            distributorDetailStore.id = params.getId;
            if (distributorDetailStore.id === "") {
                this.props.history.push(`/distributor`);
            }
            const resultApi = await callApi(
                `/v1/crawlers/distributor/profile/${distributorDetailStore.id}`,
                "GET",
                {},
                true
            )

            if (resultApi.result.status === 200) {
                // shopDetailStore.data = resultApi.result.data;
                distributorDetailStore.info = resultApi.result.data;
                distributorDetailStore.loading = false;
            }
        }
        else {
            this.props.history.push(`/distributor`);
        }
    }

    render() {
        return (
            <React.Fragment >
                <div ref={this.myRef}>
                    <div className="nav-option" style={{ backgroundColor: "#fff" }}>
                        <div className={distributorDetailStore.showAbout ? "about active" : "about"} onClick={() => distributorDetailStore.showAbout = true}>ABOUT</div>

                        <React.Fragment>
                            <Button type="primary" className="btn-back" onClick={() => this.props.history.push("/distributor")}>
                                Back
                            </Button>
                        </React.Fragment>

                    </div>
                    <div className="info-main shop-detail" >
                        {distributorDetailStore.showAbout ?
                            <About />
                            :
                            ''
                            // <Product id={shopDetailStore.id} history={this.props.history}/>
                        }

                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default React.memo(distributorDetail);