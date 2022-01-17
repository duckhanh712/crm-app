import React from "react";
import { Redirect, Route, Switch } from "react-router";


import NotFound from "../notFound/NotFound";
// import RawSeller from "../rawSeller/RawSeller";
import Crawling from "../crawling/Crawling";
import CrawlSeller from "../crawlSeller/CrawlSeller";
import ShopDetail from "../shopDetail/ShopDetail";
import Home from './../home/Home';
import HandleRedirect from './../test/HandleRedirect';
import Email from './../email/Email';
import HandleManage from './HandleManage';
import Distributor from '../distributorManage/distributor/ditributor';
import DistributorDetail from '../distributorManage/distributorDetail/distributorDetail';
import CrawSellerZS from '../wholeSale/crawlSeller/CrawlSeller';
import CrawSellerDetailZS from '../wholeSale/shopDetail/ShopDetail';
import CrawlSellerTTSCZ from '../TTSCZ/crawlSeller/CrawlSeller';
import CrawSellerDetailTTSCZ from '../wholeSale/shopDetail/ShopDetail';
import CrawSellerSD from '../Sendo/crawlSeller/CrawlSeller';
import CrawSellerDetailSD from '../Sendo/shopDetail/ShopDetail';
export const ListRouter = () => {
  return (
    <Switch> 
      <Route exact path="/" component={Home} />
      <Route exact path="/seller-info" component={CrawlSeller} />
      <Route exact path="/seller-tts-cz" component={CrawlSellerTTSCZ} />
      <Route exact path="/seller-tts-cz/shop-detail" component={CrawSellerDetailTTSCZ} />
      <Route exact path="/import-seller" component={Crawling} />
      <Route exact path="/shop-detail" component={ShopDetail} />
      <Route exact path="/email" component={Email} /> 
      <Route exact path="/login" component={HandleRedirect} />
      <Route path="/manage" component={HandleManage}/>
      <Route exact path="/404.html" component={NotFound} /> 
      <Route path="/distributor" component={Distributor}/>
      <Route exact path="/distributor-detail" component={DistributorDetail}/>
      <Route exact path="/seller-zasi" component={CrawSellerZS} />
      <Route exact path="/seller-zasi/shop-detail" component={CrawSellerDetailZS} />
      <Route exact path="/seller-chozoi-sd" component={CrawSellerSD} />
      <Route exact path="/seller-chozoi-sd/shop-detail" component={CrawSellerDetailSD} />
      <Redirect to="/404.html"/> 
    </Switch>
  );
};

