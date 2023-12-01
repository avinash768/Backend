// const https = require('https');
// const fs = require('fs');

// const apiUrl = 'https://catfact.ninja/breeds';
// const outputFilePath = 'response.txt';

// // Making a GET request
// https.get(apiUrl, (res) => {
//   let data = '';

//   // A chunk of data has been received.
//   res.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received.
//   res.on('end', () => {
//     // Parse the JSON response
//     const jsonData = JSON.parse(data);

//     // Check if there is information about pagination
//     const total = jsonData.total;
//     const next_page_url = jsonData.next_page_url
//     if (next_page_url !== undefined) {
//       console.log(`Number of pages: ${total}`);
//     } else {
//       console.log('No information about the number of pages in the response.');
//     }

//     // Write the response to a text file
//     fs.writeFileSync(outputFilePath, data);

//     console.log(`Response has been written to ${outputFilePath}`);
//   });
// }).on('error', (error) => {
//   // Handle errors
//   console.error('Error fetching data:', error.message);
// });

// const https = require('https');
// const fs = require('fs');

// const apiUrl = 'https://catfact.ninja/breeds';
// const outputFilePath = 'allBreedsData.txt';

// // Function to make a GET request for a specific page
// function fetchDataForPage(pageNumber) {
//   return new Promise((resolve, reject) => {
//     const pageUrl = `${apiUrl}?page=${pageNumber}`;
//     https.get(pageUrl, (res) => {
//       let data = '';

//       // A chunk of data has been received.
//       res.on('data', (chunk) => {
//         data += chunk;
//       });

//       // The whole response has been received.
//       res.on('end', () => {
//         resolve(data);
//       });
//     }).on('error', (error) => {
//       reject(error);
//     });
//   });
// }

// // Function to get data from all pages
// async function getAllPages() {
//   try {
//     // Fetch the first page to determine the total number of pages
//     const firstPageData = await fetchDataForPage(1);
//     const firstPageJson = JSON.parse(firstPageData);

//     const totalPages = firstPageJson.total;

//     if (totalPages !== undefined) {
//       console.log(`Number of pages: ${totalPages}`);

//       // Fetch data from all pages
//       const allPagesData = [];
//       for (let page = 1; page <= totalPages; page++) {
//         const pageData = await fetchDataForPage(page);
//         allPagesData.push(pageData);
//       }

//       // Write the response to a text file
//       fs.writeFileSync(outputFilePath, allPagesData.join('\n'));

//       console.log(`Data from all pages has been written to ${outputFilePath}`);
//     } else {
//       console.log('No information about the number of pages in the response.');
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//   }
// }

// // Call the function to get data from all pages
// getAllPages();
  
const https = require('https');
const fs = require('fs');

const apiUrl = 'https://catfact.ninja/breeds';

// Function to make a GET request for a specific page
function fetchDataForPage(pageNumber) {
  return new Promise((resolve, reject) => {
    const pageUrl = `${apiUrl}?page=${pageNumber}`;
    https.get(pageUrl, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to organize cat breeds by country
function organizeBreedsByCountry(catBreeds) {
  const breedsByCountry = {};

  catBreeds.forEach((breed) => {
    const country = breed.country;

    if (!breedsByCountry[country]) {
      breedsByCountry[country] = [];
    }

    breedsByCountry[country].push({
      breed: breed.breed,
      origin: breed.origin,
      coat: breed.coat,
      pattern: breed.pattern,
    });
  });

  return breedsByCountry;
}

// Function to get data from all pages
async function getAllPages() {
  try {
    // Fetch the first page to determine the total number of pages
    const firstPageData = await fetchDataForPage(1);
    const firstPageJson = JSON.parse(firstPageData);

    const totalPages = firstPageJson.last_page;

    if (totalPages !== undefined) {
      console.log(`Number of pages: ${totalPages}`);

      // Fetch data from all pages
      const allBreeds = [];
      for (let page = 1; page <= totalPages; page++) {
        const pageData = await fetchDataForPage(page);
        const pageJson = JSON.parse(pageData);
        allBreeds.push(...pageJson.data);
      }

      // Organize cat breeds by country
      const breedsByCountry = organizeBreedsByCountry(allBreeds);

      // Write the organized data to a text file
      const outputFilePath = 'breedsByCountry.json';
      fs.writeFileSync(outputFilePath, JSON.stringify(breedsByCountry, null, 2));

      console.log(`Data organized by country has been written to ${outputFilePath}`);
    } else {
      console.log('No information about the number of pages in the response.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Call the function to get data from all pages and organize by country
getAllPages();
