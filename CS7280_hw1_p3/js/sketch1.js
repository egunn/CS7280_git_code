var margin = {top: 50, right: 20, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

d3.csv('HW1_cleanedjs.csv', parse, dataloaded);

function parse(row) {

    return {
        id: row.ID,
        college: row.college,
        city: row.city,
        state: row.state,
        country: row.country,
        nativeLang: row.nativeLang,
        otherLang: row.otherLang,
        institution: row.institution,
        OS: row.OS,
        mobileOS: row.mobileOS,
        prefProgLang: row.prefProgLang,
        numCups: row.numCups,
        sizeCoff: row.sizeCoff,
        chocVan: row.chocVan,
        favCol: row.favCol,
        favNum: row.favNum,
        wakeup: row.wakeup,
        bedtime: row.bedtime
    };

}

function dataloaded(rows){
    //console.log(rows);

    dateCols = ['x'];
    data1 = ['data1'];


    rows.forEach(function(d){

        if (d.bedtime != ''){
            //console.log(d);
            var year = 2015;
            var month = '08';
            var hour = d.bedtime.split(':')[0];
            var end = d.bedtime.split(':')[1];
            var min = end.split(' ')[0];
            var str = end.split(' ')[1];
            //console.log(str);
            if (str == 'AM'){
                var day = '18';

                if (hour == 12){
                    hour = hour -12;
                }
            }
            else{
                day = '17';
                    hour = Number(hour) + 12;
                }
            //console.log(year, month, day, hour, min, str);

            var date = new Date (year, month, day, hour, min);
            //console.log(date);
            dateCols.push (date);
            data1.push(Number(d.numCups));
        }



    });

    //console.log(dateCols.sort(function(a,b){return a.bedtime-b.bedtime}));

    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            x: 'x',
            columns: [
                dateCols,
                data1
            ],
            type:'scatter'
        },
        axis: {
            x: {
                type: 'timeseries'
            }
        },
        point: {
            r:5
        }
    });

    var chart2 = c3.generate({
        bindto: '#chart2',
        data: {
            columns: [
                ['data1', 2, 1, 1, 2]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['c#', 'p5.js','powershell','python']
            },
            y:{
                max:9
            }
        },
        size: {
            height: 200
        },
        padding: {
            bottom: 0
        }


    });

    var chart3 = c3.generate({
        bindto: '#chart3',
        data: {
            columns: [
                ['data1', 1]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['javascript']
            },
            y:{
                max:9
            }
        },
        size: {
            height: 100
        },
        padding: {
            top:0,
            bottom: 0
        }

    });


    var chart4 = c3.generate({
        bindto: '#chart4',
        data: {
            columns: [
                ['data1', 8, 9, 1]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['java','python','R'],
                max: 10
            }
        },
        size: {
            height: 200
        },
        padding: {
            top:0,
            bottom: 0
        }

    });

    var chart5 = c3.generate({
        bindto: '#chart5',
        data: {
            columns: [
                ['data1', 2]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['java'],
                max: 10
            },
            y:{
                max:9
            }
        },
        size: {
            height: 100
        },
        padding: {
            top:0,
            bottom: 0
        }

    });

    var chart6 = c3.generate({
        bindto: '#chart6',
        data: {
            columns: [
                ['data1', 1]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['java'],
                max: 10
            },
            y:{
                max:9
            }
        },
        size: {
            height: 100
        },
        padding: {
            top:0,
            bottom: 0
        }

    });
    var chart7 = c3.generate({
        bindto: '#chart7',
        data: {
            columns: [
                ['data1', 1]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['d3.js'],
                max: 10
            },
            y:{
                max:9
            }
        },
        size: {
            height: 100
        },
        padding: {
            top:0,
            bottom: 0
        }

    });
    var chart8 = c3.generate({
        bindto: '#chart8',
        data: {
            columns: [
                ['data1', 2, 2, 1, 1]
            ],
            types: {
                data1: 'bar',
                data2: 'category'
            }
        },
        bar: {
            width: 10
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: ['java', 'javascript', 'MATLAB', 'python'],
                max: 10
            },
            y:{
                max:9
            }
        },
        size: {
            height: 200
        },
        padding: {
            top:0,
            bottom: 0
        }

    });

    var chart9 = c3.generate({
        bindto: '#chart9',
        data: {
            x: 'data1_x',
                /*data2: 'data2_x',
                data3: 'data3_x',
                data4: 'data4_x',
                data5: 'data5_x',
                data6: 'data6_x',
                data7: 'data7_x',
                data8: 'data8_x'
            },*/
            columns: [
                ["data1_x", 'China','China','China',"Germany",'India','India','India','India','India',"Iran","Nepal","Russia", "Spain","USA","USA","USA"],
                ["data1", 0, 0.5, 1, 2,0,1,2,3,4,1,0,0,3,0,1,2]
            ],
            type: 'scatter'
        },
        axis: {
            x: {
                type: 'category',
                categories: ['China',"Germany",'India',"Iran","Nepal","Russia", "Spain", "USA"],
                label: 'Country',
                tick: {
                    fit: false
                }

            },
            y: {
                type: 'category',
                label: 'Cups of Coffee'
            }
        },

        point: {
            r:5
        }

    });



}
