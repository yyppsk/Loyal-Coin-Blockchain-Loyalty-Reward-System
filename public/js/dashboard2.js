async function fetchRequestsTotal() {
    try {
      const response = await fetch("/api/getRequestsTotal");
      const data = await response.json();

      if (data.success) {
        const requestsTotal = Number(data.requestsTotal);
        // Create and render the requests total chart
        const totalRequest_tillnow = document.getElementById("totalRequests");
        totalRequest_tillnow.innerHTML = `${requestsTotal}${requestsTotal > 999 ? 'K' : ''}`;
      } else {
        console.error("Failed to fetch total requests:", data.message);
      }
    } catch (error) {
      console.error("Error fetching total requests:", error);
    }
  }
async function fetchAndProcessChartData() {
    try {
      // Fetch data from the API
      const response = await fetch("/api/getRequestsPerDay");
      const data = await response.json();
      
      if (!data.success) {
        console.error("Failed to fetch data:", data.message);
        return null;
      }
      
      // Process the data into a format suitable for ApexCharts
      const chartData = data.requestsPerDay.map(entry => ({
        x: new Date(entry.x), // Convert Unix timestamp to Date object
        y: entry.y
      }));
      
      return chartData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
}
//Display relative Date & Time
function getRelativeTime(targetISODate) {
  // Get the target date to calculate relative time
  const targetDate = luxon.DateTime.fromISO(targetISODate);

  // Get the current date and time using Luxon
  const currentDateTime = luxon.DateTime.local();

  // Calculate the difference between the current date and the target date
  const diff = currentDateTime.diff(targetDate).shiftTo('years', 'months', 'days', 'hours', 'minutes', 'seconds');

  // Extract years, months, days, hours, minutes, and seconds from the diff object
  const { years, months, days, hours, minutes, seconds } = diff.toObject();

  // Create the relative time string
  const relativeTimeString = `${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${Math.trunc(seconds)} seconds ago`;

  return relativeTimeString;
  
  }

  // Function to count active rows
function countActiveRows(tokenRequests) {
    return tokenRequests.filter((request) => !request.pending).length;
  }

  //Token Data Insertion
document.addEventListener("DOMContentLoaded", () => {
    const tokenRequestsList = document.getElementById("tokenRequestsList");
  
    async function fetchTokenRequests() {
      try {
        const response = await fetch("/api/getTokenRequests"); // Update the fetch URL
        const data = await response.json();
  
        if (data.success) {
          const tokenRequests = data.tokenRequests;
          const tokenRequestsHTML = tokenRequests
            .map( 
              (request) => `
              <li>
                  <a
                    href="#"
                    class="hover:bg-gray-100 dark:hover:bg-gray-700 block items-center p-3 sm:flex"
                  >
                    <img
                      class="mb-3 mr-3 h-12 w-12 rounded-full sm:mb-0"
                      src="${request.brand_rep_profile_image }"
                      alt="${request.brand_representative}"
                    />
                    <div class="text-gray-600 dark:text-gray-400">
                      <div class="text-base font-normal">
                        <span class="text-gray-900 font-medium dark:text-white"
                          >${request.brand_representative}</span
                        >
                        requested
                        <span class="text-gray-900 font-medium dark:text-white amount" id="amount-${request.request_id}"
                          >${request.amount}</span
                        >
                        on
                        <span class="text-gray-900 font-medium dark:text-white">
                        ${luxon.DateTime.fromISO(request.created_at).toFormat("MMMM d, yyyy, hh:mm:ss a ZZZZ")}</span
                        >
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400" style="margin-left: 2rem;>
                        <svg class="w-2.5 h-2.5 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                        </svg>
                        ${getRelativeTime(request.created_at)}
                        </span>
                      </div>
                      <div class="text-sm font-normal">
                        From ${request.brand_name} by Request id : ${request.request_id}
                        <span id="status" class="bg-${request.pending ? "green" : "purple"}-100 text-${request.pending ? "green" : "purple"}-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-${request.pending ? "green" : "purple"}-900 dark:text-${request.pending ? "green" : "purple"}-300">${request.pending ? "Processed" : "Not Yet Processed"}
                        </span>
                                            
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 inline-flex items-center text-xs font-normal">
                      <svg class="mr-1 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      
                        <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z"></path>
                        <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"></path>
                        <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z">
                        </path>
                      </svg>
                      Private Mode
                    </span>
                      <span class="text-gray-500 dark:text-gray-400 inline-flex items-center text-xs font-normal break-all" id="blockchain-address-${request.request_id}">
                        Address: ${request.blockchain_address}
                      </span>
                    </div>
                  </a>


                  <!-- Modal Handling for Transaction -->
                  
                  <!-- This Code Handles the transfer of Tokens To Brands -->

                    <button
                      type="button"
                      id="fullFillRequest-${request.request_id}"
                      class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2" >
                      <svg
                        aria-hidden="true"
                        class="w-6 h-5 mr-2 -ml-1"
                        viewBox="0 0 2405 2501"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                      <g clip-path="url(#clip0_1512_1323)">
                        <path
                          d="M2278.79 1730.86L2133.62 2221.69L1848.64 2143.76L2278.79 1730.86Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1848.64 2143.76L2123.51 1767.15L2278.79 1730.86L1848.64 2143.76Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2065.2 1360.79L2278.79 1730.86L2123.51 1767.15L2065.2 1360.79ZM2065.2 1360.79L2202.64 1265.6L2278.79 1730.86L2065.2 1360.79Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1890.29 1081.17L2285.34 919.338L2265.7 1007.99L1890.29 1081.17ZM2253.21 1114.48L1890.29 1081.17L2265.7 1007.99L2253.21 1114.48Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2253.21 1114.48L2202.64 1265.6L1890.29 1081.17L2253.21 1114.48ZM2332.34 956.82L2265.7 1007.99L2285.34 919.338L2332.34 956.82ZM2253.21 1114.48L2265.7 1007.99L2318.65 1052.01L2253.21 1114.48Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1542.24 2024.17L1641 2055.7L1848.64 2143.75L1542.24 2024.17Z"
                          fill="#E2761B"
                          stroke="#E2761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2202.64 1265.6L2253.21 1114.48L2296.64 1147.8L2202.64 1265.6ZM2202.64 1265.6L1792.71 1130.55L1890.29 1081.17L2202.64 1265.6Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1987.86 617.696L1890.29 1081.17L1792.71 1130.55L1987.86 617.696Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2285.34 919.338L1890.29 1081.17L1987.86 617.696L2285.34 919.338Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1987.86 617.696L2400.16 570.1L2285.34 919.338L1987.86 617.696Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2202.64 1265.6L2065.2 1360.79L1792.71 1130.55L2202.64 1265.6Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2382.31 236.33L2400.16 570.1L1987.86 617.696L2382.31 236.33Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2382.31 236.33L1558.3 835.45L1547.59 429.095L2382.31 236.33Z"
                          fill="#E2761B"
                          stroke="#E2761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M934.789 380.309L1547.59 429.095L1558.3 835.449L934.789 380.309Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1792.71 1130.55L1558.3 835.449L1987.86 617.696L1792.71 1130.55Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1792.71 1130.55L2065.2 1360.79L1682.65 1403.04L1792.71 1130.55Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1682.65 1403.04L1558.3 835.449L1792.71 1130.55L1682.65 1403.04Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1987.86 617.696L1558.3 835.45L2382.31 236.33L1987.86 617.696Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M940.144 2134.24L1134.69 2337.11L869.939 2096.16L940.144 2134.24Z"
                          fill="#C0AD9E"
                          stroke="#C0AD9E"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1848.64 2143.75L1940.86 1793.33L2123.51 1767.15L1848.64 2143.75Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M151.234 1157.92L487.978 803.917L194.666 1115.67L151.234 1157.92Z"
                          fill="#E2761B"
                          stroke="#E2761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2123.51 1767.15L1940.86 1793.33L2065.2 1360.79L2123.51 1767.15ZM1558.3 835.449L1230.48 824.74L934.789 380.309L1558.3 835.449Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2065.2 1360.79L1940.86 1793.33L1930.74 1582.12L2065.2 1360.79Z"
                          fill="#E4751F"
                          stroke="#E4751F"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1682.65 1403.04L2065.2 1360.79L1930.74 1582.12L1682.65 1403.04Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1230.48 824.74L1558.3 835.449L1682.65 1403.04L1230.48 824.74Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1230.48 824.74L345.784 6.08252L934.79 380.309L1230.48 824.74ZM934.195 2258.58L165.513 2496.56L12.0146 1910.53L934.195 2258.58Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M265.465 1304.27L555.803 1076.41L799.14 1132.93L265.465 1304.27Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M799.139 1132.93L555.803 1076.41L686.098 538.567L799.139 1132.93Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M194.666 1115.67L555.803 1076.41L265.465 1304.27L194.666 1115.67Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1930.74 1582.12L1780.81 1506.56L1682.65 1403.04L1930.74 1582.12Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M194.666 1115.67L169.083 980.618L555.803 1076.41L194.666 1115.67Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1749.88 1676.72L1780.81 1506.56L1930.74 1582.12L1749.88 1676.72Z"
                          fill="#233447"
                          stroke="#233447"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1940.86 1793.33L1749.88 1676.72L1930.74 1582.12L1940.86 1793.33Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M555.803 1076.41L169.082 980.618L137.55 866.982L555.803 1076.41ZM686.098 538.567L555.803 1076.41L137.55 866.982L686.098 538.567ZM686.098 538.567L1230.48 824.74L799.139 1132.93L686.098 538.567Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M799.14 1132.93L1230.48 824.74L1422.65 1411.96L799.14 1132.93ZM1422.65 1411.96L826.508 1399.47L799.14 1132.93L1422.65 1411.96Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M265.465 1304.27L799.14 1132.93L826.508 1399.47L265.465 1304.27ZM1682.65 1403.04L1422.65 1411.96L1230.48 824.74L1682.65 1403.04Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1780.81 1506.56L1749.88 1676.72L1682.65 1403.04L1780.81 1506.56Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M345.784 6.08252L1230.48 824.74L686.098 538.567L345.784 6.08252Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M12.0146 1910.53L758.088 1879.59L934.195 2258.58L12.0146 1910.53Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M934.194 2258.58L758.088 1879.59L1124.58 1861.75L934.194 2258.58Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1749.88 1676.72L1940.86 1793.33L2046.16 2041.42L1749.88 1676.72ZM826.508 1399.47L12.0146 1910.53L265.465 1304.27L826.508 1399.47ZM758.088 1879.59L12.0146 1910.53L826.508 1399.47L758.088 1879.59ZM1682.65 1403.04L1731.43 1580.33L1495.83 1594.02L1682.65 1403.04ZM1495.83 1594.02L1422.65 1411.96L1682.65 1403.04L1495.83 1594.02Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1134.69 2337.11L934.194 2258.58L1631.48 2375.79L1134.69 2337.11Z"
                          fill="#C0AD9E"
                          stroke="#C0AD9E"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M265.465 1304.27L151.234 1157.91L194.666 1115.67L265.465 1304.27Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1710.61 2288.92L1631.48 2375.79L934.194 2258.58L1710.61 2288.92Z"
                          fill="#D7C1B3"
                          stroke="#D7C1B3"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1748.09 2075.93L934.194 2258.58L1124.58 1861.75L1748.09 2075.93Z"
                          fill="#E4761B"
                          stroke="#E4761B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M934.194 2258.58L1748.09 2075.93L1710.61 2288.92L934.194 2258.58Z"
                          fill="#D7C1B3"
                          stroke="#D7C1B3"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M137.55 866.982L110.777 409.462L686.098 538.567L137.55 866.982ZM194.665 1115.67L115.536 1035.35L169.082 980.618L194.665 1115.67Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1289.38 1529.76L1422.65 1411.96L1403.61 1699.92L1289.38 1529.76Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1422.65 1411.96L1289.38 1529.76L1095.43 1630.31L1422.65 1411.96Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2046.16 2041.42L2009.87 2014.65L1749.88 1676.72L2046.16 2041.42Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1095.43 1630.31L826.508 1399.47L1422.65 1411.96L1095.43 1630.31Z"
                          fill="#CD6116"
                          stroke="#CD6116"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1403.61 1699.92L1422.65 1411.96L1495.83 1594.02L1403.61 1699.92Z"
                          fill="#E4751F"
                          stroke="#E4751F"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M89.3589 912.199L137.55 866.982L169.083 980.618L89.3589 912.199Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1403.61 1699.92L1095.43 1630.31L1289.38 1529.76L1403.61 1699.92Z"
                          fill="#233447"
                          stroke="#233447"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M686.098 538.567L110.777 409.462L345.784 6.08252L686.098 538.567Z"
                          fill="#763D16"
                          stroke="#763D16"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1631.48 2375.79L1664.2 2465.03L1134.69 2337.12L1631.48 2375.79Z"
                          fill="#C0AD9E"
                          stroke="#C0AD9E"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1124.58 1861.75L1095.43 1630.31L1403.61 1699.92L1124.58 1861.75Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M826.508 1399.47L1095.43 1630.31L1124.58 1861.75L826.508 1399.47Z"
                          fill="#E4751F"
                          stroke="#E4751F"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1495.83 1594.02L1731.43 1580.33L2009.87 2014.65L1495.83 1594.02ZM826.508 1399.47L1124.58 1861.75L758.088 1879.59L826.508 1399.47Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1495.83 1594.02L1788.55 2039.64L1403.61 1699.92L1495.83 1594.02Z"
                          fill="#E4751F"
                          stroke="#E4751F"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1403.61 1699.92L1788.55 2039.64L1748.09 2075.93L1403.61 1699.92Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1748.09 2075.93L1124.58 1861.75L1403.61 1699.92L1748.09 2075.93ZM2009.87 2014.65L1788.55 2039.64L1495.83 1594.02L2009.87 2014.65Z"
                          fill="#F6851B"
                          stroke="#F6851B"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2068.18 2224.07L1972.99 2415.05L1664.2 2465.03L2068.18 2224.07ZM1664.2 2465.03L1631.48 2375.79L1710.61 2288.92L1664.2 2465.03Z"
                          fill="#C0AD9E"
                          stroke="#C0AD9E"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1710.61 2288.92L1768.92 2265.72L1664.2 2465.03L1710.61 2288.92ZM1664.2 2465.03L1768.92 2265.72L2068.18 2224.07L1664.2 2465.03Z"
                          fill="#C0AD9E"
                          stroke="#C0AD9E"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2009.87 2014.65L2083.05 2059.27L1860.54 2086.04L2009.87 2014.65Z"
                          fill="#161616"
                          stroke="#161616"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1860.54 2086.04L1788.55 2039.64L2009.87 2014.65L1860.54 2086.04ZM1834.96 2121.15L2105.66 2088.42L2068.18 2224.07L1834.96 2121.15Z"
                          fill="#161616"
                          stroke="#161616"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M2068.18 2224.07L1768.92 2265.72L1834.96 2121.15L2068.18 2224.07ZM1768.92 2265.72L1710.61 2288.92L1748.09 2075.93L1768.92 2265.72ZM1748.09 2075.93L1788.55 2039.64L1860.54 2086.04L1748.09 2075.93ZM2083.05 2059.27L2105.66 2088.42L1834.96 2121.15L2083.05 2059.27Z"
                          fill="#161616"
                          stroke="#161616"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1834.96 2121.15L1860.54 2086.04L2083.05 2059.27L1834.96 2121.15ZM1748.09 2075.93L1834.96 2121.15L1768.92 2265.72L1748.09 2075.93Z"
                          fill="#161616"
                          stroke="#161616"
                          stroke-width="5.94955"
                        />
                        <path
                          d="M1860.54 2086.04L1834.96 2121.15L1748.09 2075.93L1860.54 2086.04Z"
                          fill="#161616"
                          stroke="#161616"
                          stroke-width="5.94955"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1512_1323">
                          <rect
                            width="2404"
                            height="2500"
                            fill="white"
                            transform="translate(0.519043 0.132812)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    Pay With Wallet
                  </button>
              </li>
            `
            )
            .join("");
  
          tokenRequestsList.innerHTML = tokenRequestsHTML;
          document.getElementById("totalActiveRequests").innerHTML =countActiveRows(tokenRequests);
        } else {
          console.error("Failed to fetch token requests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching token requests:", error);
      }
    }
  // currentDate.js

    // Get the current date and time using Luxon
    const currentDateTime = luxon.DateTime.local();
    // Use Luxon to format the current date and time
    const formattedCurrentDateTime = currentDateTime.toFormat("MMMM d, yyyy, hh:mm:ss a ZZZZ");
    // Display the formatted current date and time on the HTML page
    document.getElementById("currentDateTime").textContent = formattedCurrentDateTime;

    fetchTokenRequests();
 
});

fetch('/superadmindata')
      .then(response => response.json())
      .then(data => {
        document.getElementById('name').textContent = data.name;
        document.getElementById('email').textContent = data.email;
        document.getElementById('profilepic').innerHTML = `<img
        class="h-9 w-9 rounded-full"
        src="${data.profile_pic_address}"
        alt="user photo"
        />`
        // Populate more details if needed
      })
      .catch(error => {
        console.error('Error fetching superadmin details:', error);
});

fetchRequestsTotal();
 // ApexCharts options and config
 window.addEventListener("load", async function() {
    const chartData = await fetchAndProcessChartData();
    if (chartData && document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(document.getElementById("area-chart"), {
          chart: {
            height: "100%",
            maxWidth: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          tooltip: {
            enabled: true,
            x: {
              show: false,
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              opacityFrom: 0.55,
              opacityTo: 0,
              shade: "#1C64F2",
              gradientToColors: ["#1C64F2"],
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 6,
          },
          grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
              left: 2,
              right: 2,
              top: 0
            },
          },
          series: [
            {
              name: "Requests per Day",
              data: chartData,
              color: "#1A56DB",
            },
          ],
          xaxis: {
            type: 'datetime',
            categories: chartData.map(data => data.x), // Use x values from the chart data
            labels: {
                format: 'dd MMM yyyy',
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            show: false,
          },
        });
    
        chart.render();
      }
    });