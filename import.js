function authenticate() {
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
        // Use the token.
        console.log('token authed');
        console.log(token);
    });
}

function addEventListeners() {
    document.getElementById('doAuth').addEventListener('click', function (e) {
        authenticate();
    });
}


function getName() {
    const [base,] = document.querySelector('body > table > tbody > tr td:nth-child(2)').innerText.split('\n');

    const {
        name,
        studentid,
        grade
    } = (/(?<name>.*?) さん \[ (?<studentid>.*) \| (?<grade>.*?) \]/).exec(base).groups;

    return {
        name,
        studentid,
        grade
    };

}

function getCourses() {
    // Start from main table
    const schedule = $("#frame_set").contentWindow.document;
    const root = schedule.querySelectorAll('tr:nth-child(n+5)');

    const courselist = [];

    const course_sample = {
        DOW: 1, // 0 for others
        Period: 1, // 0 for others
        Name: '',
        Place: '',
        Teacher: '',
    };

    let otherflag = false;

    for (let dow = 1; dow < 7; dow++) {
        otherflag = (dow === 6);
        for (let per = 0; per < (otherflag ? 1 : 7); per++) {
            const cell = root[per].children[dow];
            const courses = cell.innerText.split('\n').filter(x => { return x.trim().length !== 0; }).map(x => { return x.trim() });

            if (courses.length === 0) continue;

            for (let ci = 0; ci < courses.length; ci += 2) {

                const course = {
                    DOW: dow, // 0 for others
                    Period: per + 1, // 0 for others
                    Name: '',
                    Place: '',
                    Teacher: '',
                    IsSA: false
                };

                const {
                    coursename,
                    room,
                    sa
                } = (/^(\[(G|SA)\]?)\s?(?<coursename>.*?){1}(\[(?<room>[κειολΩθτΖ][0-9]{1,4})\])?$/).exec(courses[ci]).groups;

                course.Name = coursename.trim();
                course.Place = room || '';
                course.IsSA = (sa === 'SA');

                const teachers = courses[ci + 1].replace(/[(|)]/g, '').trim();
                course.Teacher = teachers;

                courselist.push(course);

            }
        }
    }

    return courselist;
}

function sendData() {
    
   fetch('')
}