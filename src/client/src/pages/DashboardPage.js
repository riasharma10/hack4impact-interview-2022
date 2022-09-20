import React from 'react';

import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report, Embed, service, Page } from 'powerbi-client';

import '../css/report.css';

const DashboardPage = () => {
  return (
    <PowerBIEmbed
      embedConfig={{
        type: 'dashboard', // Supported types: report, dashboard, tile, visual and qna
        id: '2d964b5c-17d5-48a7-8671-73238b611e5b',
        embedUrl:
          'https://app.powerbi.com/view?r=eyJrIjoiMmY3NTk0OTItOTkyMC00MjU3LTk1MTctMjk1MTQ0MTgwZjM0IiwidCI6ImFmMTAxMjM3LTM3ZWMtNDc0MC04MTllLWZjZGYwMDdjYWZlOSJ9',
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: false,
            },
          },
          background: models.BackgroundType.Transparent,
        },
      }}
      eventHandlers={
        new Map([
          [
            'loaded',
            function () {
              console.log('Report loaded');
            },
          ],
          [
            'rendered',
            function () {
              console.log('Report rendered');
            },
          ],
          [
            'error',
            function (event) {
              console.log(event.detail);
            },
          ],
        ])
      }
      cssClassName={'report-style-class'}

      // getEmbeddedComponent={(embeddedReport) => {
      //   this.report = embeddedReport;
      // }}
    />
  );
};

export default DashboardPage;
