import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Carousel, Modal, SearchBar, WhiteSpace, WingBlank, Toast, Flex } from 'antd-mobile';
import * as goodsClassApi from '../api/goods';
import GoodsClassMenu from '../components/GoodsClassMenu';
import GoodsList from '../components/GoodsList';

import './goodsClass.less';

class GoodsClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: [],
      goodsList: []
    }
  }

  componentDidMount() {
    // Toast.loading();
    goodsClassApi.queryClasslist().then(result => {
      // Toast.hide();
      if (result.result != 1) {
        Toast.error(result.msg);
        return;
      }

      let data = result.data;
      this.setState({
        classList: data
      });

      if (data && data.length > 0) {
        this.onMenuChange(data[0]);
      }
    });
  }

  onMenuChange = ({ gcAdvid, gcId }) => {
    goodsClassApi.getGoodsClass({ advid: gcAdvid, pId: gcId }).then(result => {
      this.setState({
        goodsList: result.data[0]
      });
    });
  }

  render() {
    return (
      <div className="wx-goodsClass">
        <div className="wx-goodsClass-menu">
          <GoodsClassMenu data={this.state.classList} onMenuChange={this.onMenuChange}></GoodsClassMenu>
        </div>
        <div className="wx-goodsClass-list">
          <GoodsList data={this.state.goodsList}></GoodsList>
        </div>
      </div>
    )
  }
}

export default withRouter(GoodsClass);