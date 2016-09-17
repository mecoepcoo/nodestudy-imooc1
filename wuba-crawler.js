var http = require("http");
var url = "http://sh.58.com/ershoufang/?PGTID=0d100000-0000-2032-6d5b-28a927352215&ClickID=1";
var cheerio = require("cheerio");

function filterChapters(html) {
    var $ = cheerio.load(html);
    var chapters = $("td[class=t]");
    // console.log(chapters);
    // [{
    //     title: "",
    //     link: "",
//         unitPrice: "",
//         fullPrice: "",
//         houseType: ""
    //     ]
    //
    // }]

    var courseData = [];

    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find(".bthead").find("a").text();
        var link = chapter.find("a[class=t]").attr("href").split("http://jump.jinpai.58.com/service?target=")[1];
        // console.log(link)
        var description = chapter.find(".qj-listright");
        var fullPrice = description.find("b").text();
        var unitPrice = description.text();
        var houseType = description.find(".showroom").text();
        // console.log(description);
        //处理字符串

        unitPrice = unitPrice.substring(60, 100).replace(/\s+/g,"");
        // console.log(unitPrice);

        var chapterData = {
            chapterTitle: chapterTitle,
            link: link,
            unitPrice: unitPrice,
            fullPrice: fullPrice,
            houseType: houseType
        }

        courseData.push(chapterData);
        // console.log(courseData)

    })
    return courseData;
}

function printCourseInfo(courseData) {
    courseData.forEach(function (item) {
        var chapterTitle = item.chapterTitle;
        var fullPrice = item.fullPrice;
        var unitPrice = item.unitPrice;

        //输出结果
        console.log(chapterTitle + "\n" + "总价：" + fullPrice + "\n" + "单价：" + unitPrice + "\n");

    })
}

http.get(url, function(res){
    var html = "";

    res.on("data", function (data) {
        html += data;
    })

    res.on("end", function () {
        var courseData = filterChapters(html);

        printCourseInfo(courseData);
    })
}).on("error", function () {
    console.log("获取信息出错！");
})