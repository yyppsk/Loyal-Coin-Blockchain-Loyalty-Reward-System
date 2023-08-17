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
    const diff = targetDate.diff(currentDateTime);
  
    // Get the humanized relative time string
    const relativeTimeString =
      diff.toFormat("d 'days,' h 'hours,' m 'minutes,' s 'seconds'") + " ago";
  
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
                        <span class="text-gray-900 font-medium dark:text-white"
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
                        <span class="bg-${request.pending ? "green" : "purple"}-100 text-${request.pending ? "green" : "purple"}-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-${request.pending ? "green" : "purple"}-900 dark:text-${request.pending ? "green" : "purple"}-300">${request.pending ? "Processed" : "Not Yet Processed"}</span>
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 inline-flex items-center text-xs font-normal">
                      <svg class="mr-1 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z"></path>
                        <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"></path>
                        <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"></path>
                      </svg>
                      Private Mode
                    </span>
                    </div>
                  </a>
                </li>
            `
            )
            .join("");
  
          tokenRequestsList.innerHTML = tokenRequestsHTML;
          document.getElementById("totalActiveRequets").innerHTML =countActiveRows(tokenRequests);
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