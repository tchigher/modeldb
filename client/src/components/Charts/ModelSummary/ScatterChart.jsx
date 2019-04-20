import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from 'routes';
import * as d3 from 'd3';
import _ from 'lodash';

import { errorMessage } from 'utils/ChartHelpers';
import ModalCard from 'components/shared/ModalCard/ModalCard';
import { numberTo4Decimal } from 'utils/MapperConverters/NumberFormatter';
import styles from './ModelSummary.module.css';
const width = 680;
const height = 400;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };

class ScatterChart extends Component {
  state = {
    marks: [],
    xScale: undefined,
    yScale: undefined,
    isModelOpen: false,
    modelRecordObj: {
      name: '',
      date: '',
      metrics: [],
      hyper: [],
    },
  };

  xAxis = d3
    .axisBottom()
    .tickFormat(d3.timeFormat('%b/%d %H:%M'))
    .ticks(5);
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { flatdata, selectedMetric } = nextProps;
    if (!flatdata) {
      return {};
    }

    const extent = d3.extent(flatdata, d => d.dateCreated);
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    const [min, max] = d3.extent(flatdata, d => +d[selectedMetric]);
    const yScale = d3
      .scaleLinear()
      .domain([min * 0.95, max * 1.05])
      .range([height - margin.bottom, margin.top]);

    const marks = _.map(flatdata, d => {
      if (d[selectedMetric]) {
        let dataOnChart = d;
        dataOnChart.cx = xScale(d.dateCreated);
        dataOnChart.cy = yScale(d[selectedMetric]);
        return dataOnChart;
      }
    }).filter(obj => obj !== undefined);
    return { marks, xScale, yScale };
  }

  componentDidMount() {
    // should be update with a separate PR
    // d3.select(this.refs.annotation)
    //   .append('rect')
    //   .attr('width', '200px')
    //   .attr('height', '320px')
    //   .attr('fill', '#f9f9f9')
    //   .attr('opacity', 1);

    // d3.select(this.refs.annotation)
    //   .append('text')
    //   .attr('color', '#444')
    //   .attr('x', 20)
    //   .attr('y', 20)
    //   .attr('font-size', '11px')
    //   .text('Model Metadata');

    let xAxisLabel = 'Time Range';
    if (this.props.flatdata === undefined || this.props.flatdata.length === 0) {
      errorMessage(
        '.summaryChart',
        width,
        margin.left,
        height,
        'notAvailableMsg',
        'data not available',
        '\uf071'
      );
      xAxisLabel = 'not available';
    }

    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.xAxis)
      .append('text')
      .attr('class', 'axisLabel')
      .attr('y', margin.top)
      .attr('x', width / 2)
      .style('text-anchor', 'middle')
      .style('fill', '#444')
      .text(xAxisLabel);

    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis.ticks(6));
    d3.select(this.refs.yAxis)
      .append('text')
      .attr('id', 'scatterYLabel')
      .attr('class', 'axisLabel')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#444')
      .text(this.props.selectedMetric);

    d3.select(this.refs.yAxisGrid).call(
      this.yAxis.ticks(6).tickSize(-width + margin.right + margin.left)
    );
  }
  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis.ticks(6).tickSize(5));
    d3.select('#scatterYLabel').text(this.props.selectedMetric);
  }

  mouseOver(d) {
    d3.select(this.refs['ref-' + d.id])
      .transition()
      .attr('r', 9)
      .attr('fill', '#5fe6c9')
      .attr('opacity', 0.85);
  }
  mouseOut(d) {
    d3.select(this.refs['ref-' + d.id])
      .transition()
      .attr('r', 7)
      .attr('fill', '#6863ff')
      .attr('opacity', 0.75);
  }
  GetFormattedDate(dt) {
    let date = new Date(dt);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + '/' + day + '/' + year;
  }

  onClick(d) {
    let metricObj = [],
      hyperObj = [];
    d.metrics.forEach(d => {
      metricObj.push(d);
    });
    d.hyperparameters.forEach(d => {
      hyperObj.push(d);
    });
    this.setState({ isModelOpen: true });
    this.setState({
      modelRecordObj: {
        name: d.name,
        date: this.GetFormattedDate(d.dateCreated.toString()),
        projectId: d.projectId,
        id: d.id,
        metrics: metricObj,
        hyper: hyperObj,
      },
    });
  }
  onClose = () => {
    this.setState({ isModelOpen: false });
  };

  render() {
    return (
      <div className={styles.scatterplotBlock}>
        <ModalCard
          isOpen={this.state.isModelOpen}
          onRequestClose={this.onClose}
        >
          <div className={styles.modelCardContent}>
            <div className={styles.cardField}>
              <div className={styles.cardFieldLabel}>Name</div>
              <Link
                className={styles.cardFieldValue_Link}
                to={routes.modelRecord.getRedirectPath({
                  projectId: this.state.modelRecordObj.projectId,
                  modelRecordId: this.state.modelRecordObj.id,
                })}
              >
                <div className={styles.cardFieldValue}>
                  {this.state.modelRecordObj.name} &nbsp;
                  <i className="fa fa-external-link" />
                </div>
              </Link>
            </div>

            <div className={styles.cardField}>
              <div className={styles.cardFieldLabel}>Date: </div>
              <div className={styles.cardFieldValue}>
                {this.state.modelRecordObj.date}
              </div>
            </div>

            <div className={styles.cardField}>
              <div className={styles.cardFieldLabel}>Metrics: </div>
              <div className={styles.cardFieldValue}>
                {this.state.modelRecordObj.metrics.map((d, i) => {
                  return (
                    <div className={styles.paramCell} key={i}>
                      <div className={styles.paramKey}>{d.key + ':  '} </div>
                      <div className={styles.paramVal}>
                        {typeof d.value == 'number'
                          ? numberTo4Decimal(d.value)
                          : d.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.cardField}>
              <div className={styles.cardFieldLabel}>Hyperameters: </div>
              <div className={styles.cardFieldValue}>
                {this.state.modelRecordObj.hyper.map((d, i) => {
                  return (
                    <div className={styles.paramCell} key={i}>
                      <div className={styles.paramKey}>{d.key + ':  '} </div>
                      <div className={styles.paramVal}>
                        {typeof d.value == 'number'
                          ? numberTo4Decimal(d.value)
                          : d.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ModalCard>
        <svg width={width} height={height} className={'summaryChart'}>
          <g
            ref="yAxis"
            className="axis"
            transform={`translate(${margin.left}, 0)`}
          />
          <g
            ref="yAxisGrid"
            className="grid"
            transform={`translate(${margin.left}, 0)`}
          />
          <g
            ref="xAxis"
            className="axis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="dots" className="marks">
            {this.state.marks.map((d, i) => {
              const key = this.props.selectedMetric + i;
              return (
                <circle
                  key={key}
                  cx={d.cx}
                  cy={d.cy}
                  fill={'#6863ff'}
                  opacity={0.75}
                  r={7}
                  ref={'ref-' + d.id}
                  cursor={'pointer'}
                  onClick={this.onClick.bind(this, d)}
                  onMouseOut={this.mouseOut.bind(this, d)}
                  onMouseOver={this.mouseOver.bind(this, d)}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}

export default ScatterChart;

// Dynamic axis format will be added in a separate PR
// Establish the desired formatting options using locale.format():
// https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
// formatMillisecond = d3.timeFormat('.%L');
// formatSecond = d3.timeFormat(':%S');
// formatMinute = d3.timeFormat('%I:%M');
// formatHour = d3.timeFormat('%I');
// formatDay = d3.timeFormat('%a %d');
// formatWeek = d3.timeFormat('%b %d');
// formatMonth = d3.timeFormat('%B');
// formatYear = d3.timeFormat('%Y');

// Define filter conditions
// multiFormat(date) {
// console.log(date);
// console.log(d3.timeMinute(date) < date);
// return this.formatHour;
// return (d3.timeSecond(date) < date
//   ? this.formatHour
//   : d3.timeMinute(date) < date
//   ? this.formatHour
//   : d3.timeHour(date) < date
//   ? this.formatMinute
//   : d3.timeDay(date) < date
//   ? this.formatHour
//   : d3.timeMonth(date) < date
//   ? d3.timeWeek(date) < date
//     ? this.formatDay
//     : this.formatWeek
//   : d3.timeYear(date) < date
//   ? this.formatMonth
//   : this.formatYear)(date);
// }