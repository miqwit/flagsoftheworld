const csvFilePath='data/flags.csv'
const csv=require('csvtojson')

json_data = [];

csv()
.fromFile(csvFilePath)
.on('json', (jsonObj, rowIndex)=> {
	if (rowIndex > 0) {
		for (prop in jsonObj) {
			if ((prop == "iso") || (prop == "french_name")) {
				continue;
			}
			
			if (jsonObj[prop] != '') {
				jsonObj[prop] = true;
			} else {
				jsonObj[prop] = false;
			}
		}
	}
	json_data.push(jsonObj);
})
.on('done',()=>{
    j = JSON.stringify(json_data);
	console.log(j);
})