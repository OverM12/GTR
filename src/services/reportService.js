import api from './api';

export const reportService = {
  /**
   * Get GTR report data for a specific date range
   * @param {string} fromDate - Start date in YYYY-MM-DD format
   * @param {string} toDate - End date in YYYY-MM-DD format
   * @returns {Promise} - Promise with the report data
   */
  getGtrReport: async (fromDate, toDate) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      // console.log('Access Token:', accessToken);

      // สร้าง timezone offset ในรูป +0700 หรือ -0500
      const offsetMinutes = new Date().getTimezoneOffset(); // UTC - local
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const offsetMins = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes <= 0 ? '+' : '-';
      const tzOffset = `${sign}${String(offsetHours).padStart(2, '0')}${String(offsetMins).padStart(2, '0')}`;

      // console.log('Timezone offset in minutes:', offsetMinutes);
      // console.log('Timezone offset formatted:', tzOffset);

      // ใส่ timezone offset ลงไปใน from/to
      const fromWithTZ = `${fromDate} 00:00:00.999 ${tzOffset}`;
      const toWithTZ = `${toDate} 23:59:59.999 ${tzOffset}`;

      // console.log('From date with TZ:', fromWithTZ);
      // console.log('To date with TZ:', toWithTZ);

      const response = await api.get(`/assessments/sessions/gtr-report`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          from: fromWithTZ,
          to: toWithTZ
        }
      });

      // console.log('API response:', response);
      return response;
    } catch (error) {
      console.error('API error:', error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default reportService;
