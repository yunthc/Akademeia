// arena-data.js
// 아레나 및 싱글플레이 모드에서 사용할 문제 및 고스트 데이터 예시입니다.

// --- 문제 데이터 (총 10개) ---
export const multipleChoiceProblems = [
    {
        id: 'p1',
        question: '한 내각의 크기가 144°인 정다각형의 변의 개수는?',
        choices: ['정팔각형', '정구각형', '정십각형', '정십이각형'],
        answer: '정십각형'
    },
    {
        id: 'p2',
        question: '두 점 (-2, 3)과 (4, -5)를 잇는 선분의 중점의 좌표는?',
        choices: ['(1, -1)', '(2, -2)', '(1, -2)', '(2, -1)'],
        answer: '(1, -1)'
    },
    {
        id: 'p3',
        question: '방정식 x² - 5x + 6 = 0 의 두 근의 합은?',
        choices: ['-6', '-5', '5', '6'],
        answer: '5'
    },
    {
        id: 'p4',
        question: '반지름의 길이가 6cm인 구의 부피는?',
        choices: ['144π cm³', '216π cm³', '288π cm³', '36π cm³'],
        answer: '288π cm³'
    },
    {
        id: 'p5',
        question: '1부터 10까지의 자연수 중에서 소수는 모두 몇 개인가?',
        choices: ['3개', '4개', '5개', '6개'],
        answer: '4개'
    },
    {
        id: 'p6',
        question: '두 개의 주사위를 동시에 던질 때, 나오는 눈의 수의 합이 7이 될 확률은?',
        choices: ['1/6', '1/9', '5/36', '7/36'],
        answer: '1/6'
    },
    {
        id: 'p7',
        question: 'y = 2x + 1 그래프의 y절편은?',
        choices: ['-2', '-1', '1', '2'],
        answer: '1'
    },
    {
        id: 'p8',
        question: '한 변의 길이가 4인 정사각형의 대각선의 길이는?',
        choices: ['4', '4√2', '8', '8√2'],
        answer: '4√2'
    },
    {
        id: 'p9',
        question: '집합 A = {1, 2, 3}의 부분집합의 개수는?',
        choices: ['3', '6', '8', '9'],
        answer: '8'
    },
    {
        id: 'p10',
        question: '(-2)³의 값은?',
        choices: ['-8', '-6', '6', '8'],
        answer: '-8'
    },
    {
        id: 'p11',
        question: '등차수열 \\(a_n\\)에 대하여 \\(a_3 = 7\\)이고 \\(a_6 = 16\\)일 때, \\(a_{10}\\)의 값은?',
        choices: ['28', '31', '34', '37'],
        answer: '28'
    },
    {
        id: 'p12',
        question: '함수 \\(f(x) = x^3 - 2x^2 + 5x + 1\\)에 대하여 \\(f\'(1)\\)의 값은?',
        choices: ['2', '3', '4', '5'],
        answer: '4'
    },
    {
        id: 'p13',
        question: '$\\lim_{n \\to \\infty} \\frac{4n^2 + 3n - 1}{2n^2 - n + 2}$의 값은?',
        choices: ['0', '1', '2', '4'],
        answer: '2'
    },
    {
        id: 'p14',
        question: '$\\log_3{54} - \\log_3{2}$의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '3'
    },
    {
        id: 'p15',
        question: '확률변수 X가 이항분포 B(100, 1/5)을 따를 때, X의 평균 E(X)는?',
        choices: ['10', '20', '25', '50'],
        answer: '20'
    },
    {
        id: 'p16',
        question: '$\\int_{0}^{2} (3x^2 + 1) dx$의 값은?',
        choices: ['8', '9', '10', '12'],
        answer: '10'
    },
    {
        id: 'p17',
        question: '서로 다른 5개의 연필 중에서 3개를 선택하여 일렬로 나열하는 경우의 수는? (순열)',
        choices: ['15', '30', '60', '120'],
        answer: '60'
    },
    {
        id: 'p18',
        question: '방정식 \\(\\log_2(x-1) = 3\\)을 만족시키는 \\(x\\)의 값은?',
        choices: ['7', '8', '9', '10'],
        answer: '9'
    },
    {
        id: 'p19',
        question: '$\\sin(\\frac{\\pi}{6}) + \\cos(\\frac{\pi}{3})$의 값은?',
        choices: ['0', '1/2', '1', '√3'],
        answer: '1'
    },
    {
        id: 'p20',
        question: '수열 \\(a_n\\)의 첫째항부터 제n항까지의 합 \\(S_n = n^2 + 2n\\)일 때, \\(a_5\\)의 값은?',
        choices: ['9', '11', '13', '15'],
        answer: '11'
    },
    {
        id: 'p21',
        question: '함수 \\(f(x) = x^3 + ax - 2\\) 위의 점 \\((1, f(1))\\)에서의 접선의 기울기가 7일 때, 상수 \\(a\\)의 값은?',
        choices: ['2', '3', '4', '5'],
        answer: '4'
    },
    {
        id: 'p22',
        question: '등비수열 \\(a_n\\)에 대하여 \\(a_2 = 6\\), \\(a_5 = 48\\)일 때, 첫째항 \\(a_1\\)의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '3'
    },
    {
        id: 'p23',
        question: '$\\lim_{x \\to 1} \\frac{x^2+ax-4}{x-1} = 5$가 성립하도록 하는 상수 \\(a\\)의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '3'
    },
    {
        id: 'p24',
        question: '흰 공 4개, 검은 공 3개가 들어있는 주머니에서 임의로 2개의 공을 동시에 꺼낼 때, 두 공의 색깔이 서로 같을 확률은?',
        choices: ['2/7', '3/7', '4/7', '5/7'],
        answer: '3/7'
    },
    {
        id: 'p25',
        question: '함수 \\(f(x) = \\int (3x^2 - 4x) dx\\)이고 \\(f(1) = 0\\)일 때, \\(f(2)\\)의 값은?',
        choices: ['-1', '0', '1', '2'],
        answer: '1'
    },
    {
        id: 'p26',
        question: '다항함수 \\(f(x)\\)가 모든 실수 \\(x\\)에 대하여 \\(f(x) = 2x + \\int_{0}^{1} f(t) dt\\)를 만족시킬 때, \\(f(2)\\)의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '1'
    },
    {
        id: 'p27',
        question: '수열 \\(\\{a_n\\}\\)에 대하여 \\(\\sum_{k=1}^{10} a_k = 8\\)이고 \\(\\sum_{k=1}^{10} (a_k + 1)^2 = 48\\)일 때, \\(\\sum_{k=1}^{10} (a_k)^2\\)의 값은?',
        choices: ['20', '22', '24', '26'],
        answer: '22'
    },
    {
        id: 'p28',
        question: '주사위를 두 번 던져 나오는 눈의 수를 차례로 \\(a, b\\)라 할 때, \\(|a-b| \\leq 1\\)일 확률은?',
        choices: ['1/3', '4/9', '5/9', '2/3'],
        answer: '4/9'
    },
    {
        id: 'p29',
        question: '함수 \\(y = \\log_2{(x-a)} + b\\)의 그래프가 점 \\((3, 1)\\)을 지나고, 점근선이 직선 \\(x=1\\)일 때, \\(a+b\\)의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '2'
    },
    {
        id: 'p30',
        question: '곡선 \\(y = -x^2 + 4x\\)와 직선 \\(y = x\\)로 둘러싸인 부분의 넓이는?',
        choices: ['7/2', '4', '9/2', '5'],
        answer: '9/2'
    },
    {
        id: 'p31',
        question: '연속하는 세 홀수의 합이 81일 때, 세 홀수 중 가장 큰 수는?',
        choices: ['25', '27', '29', '31'],
        answer: '29'
    },
    {
        id: 'p32',
        question: '농도가 8%인 소금물 300g에 물을 더 넣어 농도가 6%인 소금물을 만들려고 한다. 더 넣어야 하는 물의 양은?',
        choices: ['50g', '75g', '100g', '150g'],
        answer: '100g'
    },
    {
        id: 'p33',
        question: '밑변의 길이가 10cm이고 높이가 12cm인 삼각형과 넓이가 같은 정사각형의 한 변의 길이는?',
        choices: ['√30 cm', '√60 cm', '10 cm', '12 cm'],
        answer: '√60 cm'
    },
    {
        id: 'p34',
        question: '두 개의 주사위를 동시에 던져 나오는 눈의 수를 각각 a, b라 할 때, 일차방정식 ax - b = 0의 해가 x=2일 확률은?',
        choices: ['1/12', '1/9', '1/6', '1/4'],
        answer: '1/12'
    },
    {
        id: 'p35',
        question: '이차함수 \\(y = -x^2 + 6x - 5\\)의 그래프의 최댓값은?',
        choices: ['3', '4', '5', '6'],
        answer: '4'
    },
    {
        id: 'p36',
        question: '한 변의 길이가 6cm인 정삼각형의 높이는?',
        choices: ['3 cm', '3√2 cm', '3√3 cm', '6 cm'],
        answer: '3√3 cm'
    },
    {
        id: 'p37',
        question: '전체 학생 30명인 학급에서 남학생의 1/3과 여학생의 1/2이 안경을 썼다. 안경을 쓴 학생이 총 12명일 때, 이 학급의 남학생 수는?',
        choices: ['12명', '14명', '16명', '18명'],
        answer: '18명'
    },
    {
        id: 'p38',
        question: '\\(\\sqrt{75} - \\sqrt{48} + \\sqrt{12}\\)를 간단히 하면?',
        choices: ['2√3', '3√3', '4√3', '5√3'],
        answer: '3√3'
    },
    {
        id: 'p39',
        question: '반지름의 길이가 8cm인 원에서, 중심각의 크기가 45°인 부채꼴의 넓이는?',
        choices: ['4π cm²', '8π cm²', '12π cm²', '16π cm²'],
        answer: '8π cm²'
    },
    {
        id: 'p40',
        question: 'x에 대한 이차방정식 \\(x^2 - (k+1)x + k = 0\\)이 중근을 가질 때, 상수 k의 값은?',
        choices: ['-1', '0', '1', '2'],
        answer: '1'
    },
    {
        id: 'p41',
        question: '어떤 일을 완성하는 데 A는 10일, B는 15일이 걸린다. A가 먼저 4일 동안 일한 후, 나머지를 A와 B가 함께 일하여 완성했다. A와 B가 함께 일한 기간은 며칠인가?',
        choices: ['2일', '3일', '4일', '5일'],
        answer: '4일'
    },
    {
        id: 'p42',
        question: '한 변의 길이가 8cm인 정사각형 안에 꼭 맞는 원이 있고, 그 원 안에 다시 꼭 맞는 정사각형이 있다. 가장 안쪽 정사각형의 넓이는?',
        choices: ['16 cm²', '32 cm²', '48 cm²', '64 cm²'],
        answer: '32 cm²'
    },
    {
        id: 'p43',
        question: '이차함수 \\(y = x^2 - 2x - 3\\)의 그래프가 x축과 만나는 두 점을 A, B라 하고 꼭짓점을 C라 할 때, 삼각형 ABC의 넓이는?',
        choices: ['8', '10', '12', '16'],
        answer: '8'
    },
    {
        id: 'p44',
        question: '남자 3명, 여자 4명으로 구성된 모임에서 2명의 대표를 뽑을 때, 적어도 1명이 남자가 뽑힐 확률은?',
        choices: ['4/7', '5/7', '6/7', '1'],
        answer: '5/7'
    },
    {
        id: 'p45',
        question: '두 자연수 36과 N의 최대공약수는 12이고 최소공배수는 144일 때, N의 값은?',
        choices: ['24', '36', '48', '60'],
        answer: '48'
    },
    {
        id: 'p46',
        question: '높이가 6m인 가로등 바로 밑에서 키가 1.5m인 사람이 일직선으로 걸어가고 있다. 이 사람의 그림자의 길이가 2m가 되었을 때, 이 사람은 가로등에서 몇 m 떨어져 있는가?',
        choices: ['4m', '5m', '6m', '8m'],
        answer: '6m'
    },
    {
        id: 'p47',
        question: '100원짜리 동전과 500원짜리 동전을 합하여 10개를 모았더니 총 금액이 2600원이었다. 500원짜리 동전은 몇 개인가?',
        choices: ['3개', '4개', '5개', '6개'],
        answer: '4개'
    },
    {
        id: 'p48',
        question: '두 자리 자연수 중에서 3의 배수 또는 5의 배수의 개수는?',
        choices: ['30', '36', '42', '45'],
        answer: '42'
    },
    {
        id: 'p49',
        question: '이차방정식 \\(x^2 - 4x + 1 = 0\\)의 두 근을 \\(\\alpha, \\beta\\)라 할 때, \\(\\alpha^2 + \\beta^2\\)의 값은?',
        choices: ['12', '14', '16', '18'],
        answer: '14'
    },
    {
        id: 'p50',
        question: '다음 그림에서 원 O는 직각삼각형 ABC의 내접원이고 세 변과의 접점을 각각 D, E, F라 한다. AB=10, BC=8, CA=6일 때, 원 O의 반지름의 길이는?',
        choices: ['1', '1.5', '2', '2.5'],
        answer: '2'
    },
        {
        id: 'p51',
        question: '윗변의 길이가 6, 아랫변의 길이가 10인 사다리꼴이 있다. 이 사다리꼴의 넓이가 48일 때, 높이는?',
        choices: ['4', '6', '8', '10'],
        answer: '6'
    },
    {
        id: 'p52',
        question: '다섯 개의 수 4, 7, 10, x, 12의 평균이 8일 때, 이 수들의 중앙값은?',
        choices: ['7', '7.5', '8', '8.5'],
        answer: '7'
    },
    {
        id: 'p53',
        question: 'A지점에서 B지점까지 가는데 시속 60km로, 돌아올 때는 시속 40km로 이동하여 총 5시간이 걸렸다. A지점과 B지점 사이의 거리는?',
        choices: ['100km', '120km', '150km', '180km'],
        answer: '120km'
    },
    {
        id: 'p54',
        question: '어떤 자연수를 4로 나누면 3이 남고, 5로 나누면 4가 남는다. 이러한 자연수 중 가장 작은 수는?',
        choices: ['19', '23', '29', '39'],
        answer: '19'
    },
    {
        id: 'p55',
        question: '소금의 양이 15g인 소금물에 물 50g을 더 넣었더니 농도가 10%가 되었다. 처음 소금물의 농도는?',
        choices: ['12%', '12.5%', '15%', '17.5%'],
        answer: '12.5%'
    },
    {
        id: 'p56',
        question: '현재 아버지의 나이는 아들의 나이의 3배이다. 15년 후에는 아버지의 나이가 아들의 나이의 2배가 된다고 할 때, 현재 아들의 나이는?',
        choices: ['10세', '12세', '15세', '18세'],
        answer: '15세'
    },
    {
        id: 'p57',
        question: '한 변의 길이가 12cm인 정사각형 모양의 종이를 잘라 만들 수 있는 가장 큰 원의 넓이는?',
        choices: ['12π cm²', '24π cm²', '36π cm²', '144π cm²'],
        answer: '36π cm²'
    },
    {
        id: 'p58',
        question: 'A 주머니에는 흰 공 2개와 검은 공 3개가, B 주머니에는 흰 공 3개와 검은 공 2개가 들어있다. 두 주머니 중 하나를 임의로 택하여 공 한 개를 꺼낼 때, 그 공이 흰 공일 확률은?',
        choices: ['1/2', '1/5', '2/5', '3/5'],
        answer: '1/2'
    },
    {
        id: 'p59',
        question: '정오각형의 한 외각의 크기는?',
        choices: ['60°', '72°', '90°', '108°'],
        answer: '72°'
    },
    {
        id: 'p60',
        question: '이차함수 \\(y = ax^2\\)의 그래프를 x축 방향으로 2만큼, y축 방향으로 -3만큼 평행이동한 그래프가 점 (4, 5)를 지날 때, 상수 \\(a\\)의 값은?',
        choices: ['1', '2', '3', '4'],
        answer: '2'
    },
    {
        id: 'p61',
        question: '20문제가 출제된 시험에서 한 문제를 맞히면 5점을 얻고, 틀리면 2점을 잃는다. 16문제를 맞히고 4문제를 틀렸다면 총 점수는?',
        choices: ['68점', '72점', '80점', '88점'],
        answer: '72점'
    },
    {
        id: 'p62',
        question: '반지름의 길이가 10cm인 원에서, 현 AB의 길이가 16cm일 때, 원의 중심에서 현 AB까지의 거리는?',
        choices: ['4cm', '5cm', '6cm', '8cm'],
        answer: '6cm'
    },
    {
        id: 'p63',
        question: '\\(\\frac{2025^2 - 2024^2}{2025+2024}\\)의 값은?',
        choices: ['1', '2', '2024', '2025'],
        answer: '1'
    },
    {
        id: 'p64',
        question: '연립부등식 \\(2x - 1 < 7\\) 과 \\(3x + 2 \\ge 5\\) 를 동시에 만족시키는 정수 x의 개수는?',
        choices: ['1개', '2개', '3개', '4개'],
        answer: '3개'
    },
    {
        id: 'p65',
        question: '두 이차함수 \\(y = x^2 - 2x + 3\\)과 \\(y = -x^2 + 6x - 1\\)의 꼭짓점 사이의 거리는?',
        choices: ['√17', '√20', '5', '6'],
        answer: '5'
    },
    {
        id: 'p66',
        question: '밑면의 반지름이 3cm이고 높이가 4cm인 원뿔의 겉넓이는?',
        choices: ['15π cm²', '21π cm²', '24π cm²', '27π cm²'],
        answer: '24π cm²'
    },
    {
        id: 'p67',
        question: '집합 A={1,3,5,7,9}의 진부분집합의 개수는?',
        choices: ['15', '16', '31', '32'],
        answer: '31'
    },
    {
        id: 'p68',
        question: '일차함수 \\(y = -\\frac{2}{3}x + 4\\)의 그래프와 x축, y축으로 둘러싸인 삼각형의 넓이는?',
        choices: ['6', '8', '12', '24'],
        answer: '12'
    },
    {
        id: 'p69',
        question: '두 개의 닮은 원기둥 A, B의 닮음비가 2:3이다. A의 부피가 48π일 때, B의 부피는?',
        choices: ['72π', '96π', '108π', '162π'],
        answer: '162π'
    },
    {
        id: 'p70',
        question: '1부터 4까지의 숫자가 적힌 카드 4장 중 2장을 뽑아 만들 수 있는 두 자리 자연수가 3의 배수일 확률은?',
        choices: ['1/4', '1/3', '5/12', '1/2'],
        answer: '1/3'
    },
        {
        id: 'p71',
        question: '어떤 두 자리 자연수를 6으로 나누면 5가 남고, 8로 나누면 7이 남는다. 이러한 자연수 중 가장 큰 수는?',
        choices: ['47', '71', '83', '95'],
        answer: '95'
    },
    {
        id: 'p72',
        question: '자연수 \\(N = 2^2 \\times 3 \\times 5\\) 이다. N의 모든 약수의 합은?',
        choices: ['120', '160', '180', '240'],
        answer: '240'
    },
    {
        id: 'p73',
        question: '세 자리 자연수 중에서 15의 배수는 총 몇 개인가?',
        choices: ['58개', '60개', '62개', '64개'],
        answer: '60개'
    },
    {
        id: 'p74',
        question: '네 자리 자연수 \'35a2\'가 4의 배수일 때, a에 들어갈 수 없는 숫자는?',
        choices: ['1', '3', '7', '8'],
        answer: '8'
    },
    {
        id: 'p75',
        question: '두 자연수 A, B의 최대공약수는 6이고, 최소공배수는 90이다. A+B=72일 때, 두 수의 차 |A-B|는?',
        choices: ['12', '18', '24', '30'],
        answer: '12'
    },
    {
        id: 'p76',
        question: '가로, 세로, 높이가 각각 24cm, 30cm, 18cm인 직육면체 모양의 나무토막을 잘라, 가능한 한 큰 동일한 크기의 정육면체 모양의 주사위를 여러 개 만들려고 한다. 주사위의 한 모서리의 길이는?',
        choices: ['3cm', '4cm', '6cm', '8cm'],
        answer: '6cm'
    },
    {
        id: 'p77',
        question: '1부터 100까지의 자연수 중 6과 서로소인 자연수의 개수는?',
        choices: ['33', '34', '49', '50'],
        answer: '33'
    },
    {
        id: 'p78',
        question: '십의 자리 숫자가 일의 자리 숫자보다 3만큼 큰 두 자리 자연수가 있다. 이 자연수는 각 자리 숫자의 합의 7배와 같다. 이 자연수는?',
        choices: ['41', '52', '63', '74'],
        answer: '63'
    },
    {
        id: 'p79',
        question: '두 분수 \\(\\frac{n}{12}\\)과 \\(\\frac{n}{15}\\)를 모두 자연수로 만드는 자연수 \\(n\\)의 최솟값은?',
        choices: ['30', '45', '60', '180'],
        answer: '60'
    },
    {
        id: 'p80',
        question: '144의 약수 중에서 어떤 자연수의 제곱이 되는 수는 모두 몇 개인가?',
        choices: ['3개', '4개', '5개', '6개'],
        answer: '4개'
    },
    {
        id: 'p91',
        question: '\\(7^{1002}\\)의 마지막 두 자리 수는?',
        choices: ['01', '07', '43', '49'],
        answer: '49'
    },
    {
        id: 'p81',
        question: '어떤 정수를 8로 나누면 나머지가 5이고, 12로 나누면 나머지가 9이다. 이 정수를 24로 나눈 나머지는?',
        choices: ['17', '20', '21', '23'],
        answer: '21'
    },
    {
        id: 'p82',
        question: '세 자연수 2, 3, 4 중 어느 것으로 나누어도 나머지가 1인 가장 작은 세 자리 자연수는?',
        choices: ['109', '113', '121', '125'],
        answer: '121'
    },
    {
        id: 'p83',
        question: '두 자연수 A, B에 대하여 A ★ B를 \\(A \\times B\\)를 A와 B의 최대공약수로 나눈 값이라고 정의할 때, 18 ★ 24의 값은?',
        choices: ['36', '48', '72', '144'],
        answer: '72'
    },
    {
        id: 'p84',
        question: '어떤 세 자리 자연수가 3과 5와 8로 모두 나누어떨어진다고 한다. 이러한 세 자리 자연수 중 가장 작은 수는?',
        choices: ['120', '150', '240', '360'],
        answer: '120'
    },
    {
        id: 'p85',
        question: '두 수 75와 100의 공배수 중에서 300보다 크고 600보다 작은 수의 개수는?',
        choices: ['1개', '2개', '3개', '4개'],
        answer: '1개'
    },
    {
        id: 'p86',
        question: '두 자리 자연수 중에서 4의 배수이면서 6의 배수인 수의 개수는?',
        choices: ['6개', '7개', '8개', '9개'],
        answer: '7개'
    },
    {
        id: 'p87',
        question: '5로 나누면 3이 남고, 7로 나누면 5가 남는 가장 작은 자연수는?',
        choices: ['18', '23', '33', '38'],
        answer: '33'
    },
    {
        id: 'p88',
        question: '어떤 두 자연수의 곱은 180이고, 최대공약수는 6이다. 이 두 자연수의 합은?',
        choices: ['24', '30', '36', '42'],
        answer: '36'
    },
    {
        id: 'p89',
        question: '세 분수 \\(\\frac{1}{2}\\), \\(\\frac{1}{3}\\), \\(\\frac{1}{4}\\) 중 어느 것을 곱해도 자연수가 되는 가장 작은 자연수는?',
        choices: ['6', '8', '12', '24'],
        answer: '12'
    },
    {
        id: 'p90',
        question: '두 정수 A와 B의 절댓값이 각각 5와 3일 때, A+B의 최솟값은?',
        choices: ['-8', '-2', '2', '8'],
        answer: '-8'
    },
    {
        id: 'p92',
        question: '방정식 \\(17x \\equiv 3 \\pmod{29}\\)의 해가 될 수 있는 것은?',
        choices: ['11', '12', '13', '14'],
        answer: '12'
    },
    {
        id: 'p93',
        question: '오일러 파이 함수 \\(\\phi(100)\\)의 값은?',
        choices: ['20', '40', '50', '80'],
        answer: '40'
    },
    {
        id: 'p94',
        question: '윌슨의 정리를 이용하여 \\(10! \\pmod{13}\\)의 값을 구하면?',
        choices: ['-1', '0', '1', '12'],
        answer: '0'
    },
    {
        id: 'p95',
        question: '연립 합동식 \\(x \\equiv 1 \\pmod{3}\\), \\(x \\equiv 2 \\pmod{4}\\)를 만족하는 가장 작은 양의 정수 x는?',
        choices: ['4', '6', '10', '22'],
        answer: '10'
    },
    {
        id: 'p96',
        question: '법 11에 대한 원시근(primitive root)이 아닌 것은?',
        choices: ['2', '3', '6', '8'],
        answer: '3'
    },
    {
        id: 'p97',
        question: '르장드르 기호 \\((\\frac{5}{19})\\)의 값은?',
        choices: ['-1', '0', '1', '정의되지 않음'],
        answer: '1'
    },
    {
        id: 'p98',
        question: '정수 341은 \\(2^{341} \\equiv 2 \\pmod{341}\\)을 만족한다. 341의 소인수분해는?',
        choices: ['11 x 31', '13 x 29', '17 x 23', '소수이다'],
        answer: '11 x 31'
    },
    {
        id: 'p99',
        question: '뫼비우스 함수 \\(\\mu(30)\\)의 값은?',
        choices: ['-1', '0', '1', '2'],
        answer: '-1'
    },
    {
        id: 'p100',
        question: '타원곡선 \\(y^2 = x^3 - 2x + 2\\) 위의 두 점 P=(1,1), Q=(3,5)에 대하여 P+Q의 좌표는?',
        choices: ['(-2, 1)', '(-1, -2)', '(0, √2)', '(2, 2)'],
        answer: '(-1, -2)'
    },
    {
        id: 'p101',
        question: '두 수 a, b가 \\(a + b = 10\\), \\(ab = 16\\)일 때, \\(a^2 + b^2\\)의 값은?',
        choices: ['36', '40', '48', '52'],
        answer: '52'
    },
    {
        id: 'p102',
        question: '두 직선 \\(y = 2x + 1\\)과 \\(y = -\\frac{1}{2}x + 3\\)이 이루는 예각의 크기는?',
        choices: ['45°', '53°', '63°', '73°'],
        answer: '63°'
    },
    {
        id: 'p103',
        question: '\\(a^2 + b^2 = 25\\), \\(ab = 12\\)일 때, \\((a + b)^2\\)의 값은?',
        choices: ['31', '36', '49', '61'],
        answer: '49'
    },
    {
        id: 'p104',
        question: '한 정사각형의 둘레가 24cm일 때, 이 정사각형 안에 내접하는 원의 넓이는?',
        choices: ['16π', '25π', '36π', '49π'],
        answer: '36π'
    },
    {
        id: 'p105',
        question: '수열 \\(a_n\\)이 \\(a_1 = 2\\), \\(a_{n+1} = 3a_n + 1\\)일 때, \\(a_3\\)의 값은?',
        choices: ['19', '20', '21', '22'],
        answer: '22'
    },
    {
        id: 'p106',
        question: '길이가 각각 5cm, 12cm, 13cm인 삼각형의 넓이는?',
        choices: ['30', '32', '36', '39'],
        answer: '30'
    },
    {
        id: 'p107',
        question: '정사각형의 대각선 길이가 10√2cm일 때, 넓이는?',
        choices: ['50', '100', '200', '400'],
        answer: '100'
    },
    {
        id: 'p108',
        question: '두 수 x, y가 \\(x+y = 5\\), \\(x^3 + y^3 = 125\\)일 때, \\(xy\\)의 값은?',
        choices: ['0', '1', '2', '3'],
        answer: '0'
    },
    {
        id: 'p109',
        question: '원의 방정식 \\(x^2 + y^2 + 4x - 6y + 9 = 0\\)의 중심 좌표는?',
        choices: ['(-2, 3)', '(2, -3)', '(2, 3)', '(-2, -3)'],
        answer: '(-2, 3)'
    },
    {
        id: 'p110',
        question: '세 수 a, b, c가 등비수열이고, \\(a + b + c = 21\\), \\(abc = 216\\)일 때, b의 값은?',
        choices: ['6', '8', '9', '12'],
        answer: '9'
    },
    {
        id: 'p111',
        question: '좌표평면 위 점 A(1, 2)를 x축 대칭 이동시키고, 그 점을 다시 y축 대칭 이동시킨 결과의 좌표는?',
        choices: ['(1, -2)', '(-1, 2)', '(-1, -2)', '(2, -1)'],
        answer: '(-1, -2)'
    },
    {
        id: 'p112',
        question: '두 함수 \\(y = x^2\\), \\(y = 4x\\)의 교점 사이 거리의 길이는?',
        choices: ['2√5', '4', '2√2', '4√2'],
        answer: '2√5'
    },
    {
        id: 'p113',
        question: '정수 x에 대해 \\(x^2 - 5x + 6 < 0\\)을 만족시키는 x의 개수는?',
        choices: ['1', '2', '3', '4'],
        answer: '2'
    },
    {
        id: 'p114',
        question: '두 실수의 평균이 7이고, 이 두 수의 곱이 40일 때, 두 수의 차는?',
        choices: ['2', '4', '6', '8'],
        answer: '6'
    },
    {
        id: 'p115',
        question: '정사각형의 대각선 길이가 6cm일 때, 넓이는?',
        choices: ['9', '12', '18', '36'],
        answer: '18'
    },
    {
        id: 'p116',
        question: '\\(x - \\frac{1}{x} = 3\\)일 때, \\(x^2 + \\frac{1}{x^2}\\)의 값은?',
        choices: ['7', '8', '9', '10'],
        answer: '10'
    },
    {
        id: 'p117',
        question: '세 수 \\(a, b, c\\)가 등차수열이고 \\(a + b + c = 15\\), \\(ac = 56\\)일 때, b는?',
        choices: ['5', '6', '7', '8'],
        answer: '7'
    },
    {
        id: 'p118',
        question: '\\(x^2 - 4x + 5 = 0\\)의 두 근 \\(\\alpha, \\beta\\)에 대하여 \\(\\alpha^2 + \\beta^2\\)의 값은?',
        choices: ['8', '10', '12', '14'],
        answer: '10'
    },
    {
        id: 'p119',
        question: '두 원의 중심 사이의 거리가 10이고, 반지름이 각각 3과 7일 때, 두 원은 어떤 위치관계에 있는가?',
        choices: ['외접', '내접', '겹침', '떨어짐'],
        answer: '외접'
    },
    {
        id: 'p120',
        question: '한 직선이 x축과 이루는 각이 60°일 때, 그 직선의 기울기는?',
        choices: ['1', '√3', '1/2', '1/√3'],
        answer: '√3'
    },
    {
        id: 'p121',
        question: '\\(a + \\frac{1}{a} = 5\\)일 때, \\(a^2 + \\frac{1}{a^2}\\)의 값은?',
        choices: ['21', '23', '25', '27'],
        answer: '23'
    },
    {
        id: 'p122',
        question: '1에서 100까지의 자연수 중, 3의 배수이면서 5의 배수인 수의 개수는?',
        choices: ['5', '6', '7', '8'],
        answer: '6'
    },
    {
        id: 'p123',
        question: '세 점 A(2, 3), B(4, 7), C(x, 11)이 한 직선 위에 있을 때, x의 값은?',
        choices: ['5', '6', '7', '8'],
        answer: '6'
    },
    {
        id: 'p124',
        question: '지수방정식 \\(2^x + 2^{x+1} = 48\\)의 해는?',
        choices: ['3', '4', '5', '6'],
        answer: '4'
    },
    {
        id: 'p125',
        question: '함수 \\(y = x^2 - 6x + 13\\)의 최솟값은?',
        choices: ['4', '5', '6', '7'],
        answer: '4'
    },
    {
        id: 'p126',
        question: '\\(\\sqrt{7 + 4\\sqrt{3}}\\)을 \\(\\sqrt{a} + \sqrt{b}\\) 꼴로 나타낼 때, a + b는?',
        choices: ['10', '11', '12', '13'],
        answer: '10'
    },
    {
        id: 'p127',
        question: '어떤 수에 4를 곱하고 3을 더했더니, 그 수의 제곱과 같아졌다. 이 수는?',
        choices: ['1', '2', '3', '4'],
        answer: '3'
    },
    {
        id: 'p128',
        question: '세 점 A(1, 1), B(3, 5), C(5, 9)가 이루는 삼각형의 넓이는?',
        choices: ['0', '2', '4', '6'],
        answer: '0'
    },
    {
        id: 'p129',
        question: '두 항 사이의 곱이 일정한 수열이 있다. 첫째항이 2이고, 네 번째 항이 54일 때, 공비는?',
        choices: ['2', '3', '4', '5'],
        answer: '3'
    },
    {
        id: 'p130',
        question: '\\(x^3 - 3x^2 + 3x - 1\\)을 인수분해하면?',
        choices: ['(x - 1)^3', '(x + 1)^3', '(x - 1)^2(x + 1)', 'x(x - 1)^2'],
        answer: '(x - 1)^3'
    },
    {
        "id": "p131",
        "question": "실수 x, y에 대하여 \\(x^2 + y^2 = 1\\)일 때, \\(x + y\\)의 최댓값은?",
        "choices": ["1", "√2", "2", "없다"],
        "answer": "√2"
    },
    {
        "id": "p132",
        "question": "함수 \\(f(x) = \\ln(x^2 + 1)\\)의 도함수 \\(f'(x)\\)가 0이 되는 모든 x의 개수는?",
        "choices": ["0개", "1개", "2개", "무수히 많다"],
        "answer": "1개"
    },
    {
        "id": "p133",
        "question": "두 점 \\(A(1,2)\\), \\(B(5,6)\\)를 지나는 직선과 점 \\(P(3,0)\\) 사이의 거리는?",
        "choices": ["2", "2√2", "3", "3√2"],
        "answer": "2√2"
    },
    {
        "id": "p134",
        "question": "행렬 \\(A = \\begin{bmatrix}1 & 2 \\\\ 3 & 4\\end{bmatrix}\\)에 대해 \\(A^2\\)의 (1,2) 성분은?",
        "choices": ["10", "14", "16", "18"],
        "answer": "14"
    },
    {
        "id": "p135",
        "question": "두 복소수 \\(z_1 = 1+i\\), \\(z_2 = \\sqrt{3} + i\\)의 곱의 절댓값은?",
        "choices": ["2", "√10", "2√2", "4"],
        "answer": "2√2"
    },
    {
        "id": "p136",
        "question": "함수 \\(f(x) = x^3 - 3x\\)의 극댓값과 극솟값의 차는?",
        "choices": ["2", "3", "4", "6"],
        "answer": "6"
    },
    {
        "id": "p137",
        "question": "삼각형의 내심과 외심의 거리가 최소가 되는 삼각형의 조건은?",
        "choices": ["정삼각형", "직각삼각형", "둔각삼각형", "예각삼각형"],
        "answer": "정삼각형"
    },
    {
        "id": "p138",
        "question": "부등식 \\(x^2 - 5x + 6 < 0\\)을 만족시키는 정수 x의 개수는?",
        "choices": ["1개", "2개", "3개", "4개"],
        "answer": "2개"
    },
    {
        "id": "p139",
        "question": "\\(a_n = 3a_{n-1} - 2\\), \\(a_1 = 1\\)인 수열의 일반항 \\(a_n\\)은?",
        "choices": ["3^n", "3^{n-1} + 1", "2^{n+1}", "3^{n-1} - 1"],
        "answer": "3^{n-1} - 1"
    },
    {
        "id": "p140",
        "question": "도형 \\(x^2 + y^2 = 25\\)와 \\(y = x\\)가 교차하는 점의 좌표는?",
        "choices": ["(3,3)", "(4,4)", "(5,5)", "(5√2/2, 5√2/2)"],
        "answer": "(5√2/2, 5√2/2)"
    },
    {
        "id": "p151",
        "question": "다항식 \\(f(x) = x^3 - 4x^2 + 5x - 2\\)를 \\(x-1\\)로 나누었을 때 나머지는?",
        "choices": ["0", "1", "2", "3"],
        "answer": "0"
    },
    {
        "id": "p152",
        "question": "지수함수 \\(f(x) = 2^x\\)와 \\(g(x) = 4x\\)의 교점 개수는?",
        "choices": ["0개", "1개", "2개", "무수히 많다"],
        "answer": "1개"
    },
    {
        "id": "p153",
        "question": "\\(\\log_2(x^2 - 4) = 3\\)을 만족하는 양수 x의 값은?",
        "choices": ["4", "5", "6", "8"],
        "answer": "6"
    },
    {
        "id": "p154",
        "question": "평균이 70, 표준편차가 10인 정규분포에서 80 이상의 점수를 받을 확률은?",
        "choices": ["0.1587", "0.3085", "0.5", "0.8413"],
        "answer": "0.1587"
    },
    {
        "id": "p155",
        "question": "좌표평면에서 \\(|x-2| + |y+1| \\le 3\\)인 영역의 넓이는?",
        "choices": ["9", "12", "18", "6"],
        "answer": "18"
    }
];





export const tfProblems = [
    // --- 난이도 100-400 (초등/기초 중등) ---
    {
        id: 'tf001',
        proposition: '정사각형은 마름모의 일종이다.',
        answer: true,
        difficulty: 100
    },
    {
        id: 'tf002',
        proposition: '모든 소수는 홀수이다.',
        answer: false, // 2는 짝수 소수
        difficulty: 150
    },
    {
        id: 'tf003',
        proposition: '0은 양수도 음수도 아니다.',
        answer: true,
        difficulty: 200
    },
    {
        id: 'tf004',
        proposition: '두 음수의 곱은 항상 양수이다.',
        answer: true,
        difficulty: 250
    },
    {
        id: 'tf005',
        proposition: '1의 모든 제곱근은 1이다.',
        answer: false, // -1도 포함
        difficulty: 300
    },
    {
        id: 'tf006',
        proposition: '삼각형의 세 내각의 합은 180°이다.',
        answer: true,
        difficulty: 350
    },
    {
        id: 'tf007',
        proposition: '두 짝수의 합은 항상 4의 배수이다.',
        answer: false, // 예: 2 + 4 = 6
        difficulty: 400
    },

    // --- 난이도 401-900 (중등 심화/고등 기초) ---
    {
        id: 'tf008',
        proposition: '이차방정식 \\(x^2 - 3x + 3 = 0\\)은 서로 다른 두 실근을 갖는다.',
        answer: false, // 판별식 D < 0
        difficulty: 450
    },
    {
        id: 'tf009',
        proposition: 'y는 x에 반비례할 때, x와 y의 곱은 항상 일정하다.',
        answer: true, // y = a/x -> xy = a
        difficulty: 500
    },
    {
        id: 'tf010',
        proposition: '모든 실수는 제곱하면 0 이상이 된다.',
        answer: true,
        difficulty: 550
    },
    {
        id: 'tf011',
        proposition: '두 집합 A, B에 대하여, \\(A \\subset B\\)이면 \\(A \\cup B = A\\)이다.',
        answer: false, // A ∪ B = B
        difficulty: 650
    },
    {
        id: 'tf012',
        proposition: '$\\sqrt{9}$의 제곱근은 3이다.',
        answer: false, // √9=3. 3의 제곱근은 ±√3
        difficulty: 750
    },
    {
        id: 'tf013',
        proposition: '\\(y = -2x + 5\\)의 그래프는 제 3사분면을 지나지 않는다.',
        answer: true, // x>0, y>0 구간만 지남 (1,2,4분면)
        difficulty: 800
    },
    {
        id: 'tf014',
        proposition: '어떤 명제가 참이면, 그 명제의 대우도 반드시 참이다.',
        answer: true,
        difficulty: 900
    },

    // --- 난이도 901-1500 (고등 심화/수능 3-4점) ---
    {
        id: 'tf015',
        proposition: '함수 \\(f(x)=|x-1|\\)은 \\(x=1\\)에서 미분가능하다.',
        answer: false, // 연속이지만 미분 불가능 (뾰족점)
        difficulty: 950
    },
    {
        id: 'tf016',
        proposition: '수열 \\(a_n\\)이 수렴하면, 급수 \\(\\sum_{n=1}^{\\infty} a_n\\)도 수렴한다.',
        answer: false, // 역은 성립하지 않음. 예: a_n = 1/n
        difficulty: 1050
    },
    {
        id: 'tf017',
        proposition: '$\\int_{-a}^{a} x^3 \\cos(x) dx = 0$ 이다.',
        answer: true, // 기함수 * 우함수 = 기함수. 대칭구간 정적분은 0.
        difficulty: 1150
    },
    {
        id: 'tf018',
        proposition: '두 사건 A, B가 서로 배반사건이면, 두 사건은 서로 독립이다.',
        answer: false, // P(A)>0, P(B)>0일 때, 배반사건은 항상 종속
        difficulty: 1250
    },
    {
        id: 'tf019',
        proposition: '복소수 z에 대하여, z와 그 켤레복소수 z̄의 합은 항상 실수이다.',
        answer: true, // (a+bi) + (a-bi) = 2a
        difficulty: 1350
    },
    {
        id: 'tf020',
        proposition: '두 행렬 A, B에 대하여, AB=BA가 항상 성립한다.',
        answer: false, // 행렬의 곱셈은 교환법칙이 성립하지 않음
        difficulty: 1450
    },

    // --- 난이도 1501-2000 (대학교 교양/전공 수준) ---
    {
        id: 'tf021',
        proposition: '유리수의 집합 \\(\\mathbb{Q}\\)는 조밀(dense)하지만 완비성(complete)을 갖지는 않는다.',
        answer: true,
        difficulty: 1550
    },
    {
        id: 'tf022',
        proposition: 'p가 5 이상의 소수일 때, \\(p^2 - 1\\)은 항상 24의 배수이다.',
        answer: true, // p=6k±1 꼴. p²-1 = (p-1)(p+1)
        difficulty: 1650
    },
    {
        id: 'tf023',
        proposition: '모든 벡터 공간(vector space)은 기저(basis)를 갖는다.',
        answer: true, // 선택 공리와 동치
        difficulty: 1750
    },
    {
        id: 'tf024',
        proposition: '군(Group) G의 모든 진부분군(proper subgroup)이 순환군(cyclic)이면, G 자신도 반드시 순환군이다.',
        answer: false, // 반례: 클라인 4원군
        difficulty: 1800
    },
    {
        id: 'tf025',
        proposition: '리만 가설은 아직 증명되지 않았다.',
        answer: true,
        difficulty: 1850
    },
    {
        id: 'tf026',
        proposition: '칸토어의 정리에 따르면, 임의의 집합 A에 대하여, A의 멱집합 P(A)의 크기(cardinality)는 A의 크기보다 항상 크다.',
        answer: true,
        difficulty: 1900
    },
    {
        id: 'tf027',
        proposition: '정수환 \\(\\mathbb{Z}\\)의 모든 아이디얼(ideal)은 주 아이디얼(principal ideal)이다.',
        answer: true, // PID (주 아이디얼 정역)의 정의
        difficulty: 1950
    },
    {
        id: 'tf028',
        proposition: '위상 공간에서, 모든 콤팩트 집합은 닫힌 집합이다.',
        answer: false, // 하우스도르프 공간(Hausdorff space)이라는 조건이 필요
        difficulty: 1980
    },
    {
        id: 'tf029',
        proposition: '괴델의 불완전성 정리는 수학의 모든 명제가 증명 가능하거나 반증 가능함을 보여주었다.',
        answer: false, // 정반대. 증명도 반증도 불가능한 명제가 존재함을 보임.
        difficulty: 1990
    },
    {
        id: 'tf030',
        proposition: '타원곡선 y² = x³ + ax + b 는 모든 점에서 미분가능하다.',
        answer: false, // 판별식이 0일 경우 특이점(cusp 또는 node)을 가질 수 있음
        difficulty: 2000
    },
    {
        id: 'tf001',
        proposition: '정사각형은 마름모의 일종이다.',
        answer: true,
        difficulty: 100
    },
    {
        id: 'tf003',
        proposition: '0은 양수도 음수도 아니다.',
        answer: true,
        difficulty: 120
    },
    {
        id: 'tf002',
        proposition: '모든 소수는 홀수이다.',
        answer: false, // 반례: 2
        difficulty: 150
    },
    {
        id: 'tf006',
        proposition: '삼각형의 세 내각의 합은 180°이다.',
        answer: true,
        difficulty: 180
    },
    {
        id: 'tf005',
        proposition: '1의 모든 제곱근은 1이다.',
        answer: false, // -1도 제곱하면 1이 됨
        difficulty: 300
    },
    {
        id: 'tf007',
        proposition: '두 짝수의 합은 항상 4의 배수이다.',
        answer: false, // 반례: 2 + 4 = 6
        difficulty: 420
    },
    {
        id: 'tf010',
        proposition: '모든 실수는 제곱하면 0 이상이 된다.',
        answer: true,
        difficulty: 480
    },

    // --- 난이도 501-1000 (중등 심화) ---
    {
        id: 'tf009',
        proposition: 'y는 x에 반비례할 때, x와 y의 곱은 항상 일정하다.',
        answer: true, // y = a/x -> xy = a
        difficulty: 520
    },
    {
        id: 'tf008',
        proposition: '이차방정식 \\(x^2 - 3x + 3 = 0\\)은 서로 다른 두 실근을 갖는다.',
        answer: false, // 판별식 D = 9 - 12 = -3 < 0
        difficulty: 580
    },
    {
        id: 'tf011',
        proposition: '두 집합 A, B에 대하여, \\(A \\subset B\\)이면 \\(A \\cup B = A\\)이다.',
        answer: false, // A ∪ B = B
        difficulty: 650
    },
    {
        id: 'tf013',
        proposition: '\\(y = -2x + 5\\)의 그래프는 제 3사분면을 지나지 않는다.',
        answer: true, // x절편=2.5, y절편=5
        difficulty: 750
    },
    {
        id: 'tf012',
        proposition: '$\\sqrt{9}$의 제곱근은 3이다.',
        answer: false, // √9는 3이고, '3의 제곱근'은 ±√3
        difficulty: 850
    },
    {
        id: 'tf014',
        proposition: '어떤 명제가 참이면, 그 명제의 대우도 반드시 참이다.',
        answer: true, // 명제와 대우는 동치 관계
        difficulty: 950
    },
    
    // --- 난이도 1001-2000 (고등 과정) ---
    {
        id: 'tf019',
        proposition: '복소수 z에 대하여, z와 그 켤레복소수 z̄의 합은 항상 실수이다.',
        answer: true, // (a+bi) + (a-bi) = 2a
        difficulty: 1050
    },
    {
        id: 'tf015',
        proposition: '함수 \\(f(x)=|x-1|\\)은 \\(x=1\\)에서 연속이지만 미분가능하지 않다.',
        answer: true, // 대표적인 첨점(뾰족점)
        difficulty: 1100
    },
    {
        id: 'tf020',
        proposition: '두 행렬 A, B에 대하여, (AB)² = A²B² 이 항상 성립한다.',
        answer: false, // AB=BA일 때만 성립
        difficulty: 1200
    },
    {
        id: 'tf016',
        proposition: '무한급수 \\(\\sum_{n=1}^{\\infty} a_n\\)이 수렴하면, \\(\\lim_{n \\to \\infty} a_n = 0\\) 이다.',
        answer: true, // 급수 수렴의 필요조건 (역은 성립 안 함)
        difficulty: 1300
    },
    {
        id: 'tf017',
        proposition: '$\\int_{-1}^{1} (x^3 + x^2 + x) dx = \\int_{-1}^{1} x^2 dx$ 이다.',
        answer: true, // x³과 x는 기함수이므로 대칭구간 정적분 값은 0
        difficulty: 1400
    },
    {
        id: 'tf018',
        proposition: '두 사건 A, B가 서로 배반사건이면, 두 사건은 서로 종속사건이다. (단, P(A)>0, P(B)>0)',
        answer: true, // P(A∩B)=0 이므로 P(B|A)=0. P(B)와 다르므로 종속.
        difficulty: 1500
    },
    {
        id: 'tf025', // 이전 ID 재사용 및 난이도 조정
        proposition: '페르마의 마지막 정리는 n이 3 이상인 정수일 때, \\(x^n+y^n=z^n\\)을 만족하는 양의 정수 x,y,z가 존재하지 않는다는 정리이다.',
        answer: true,
        difficulty: 1750
    },

    // --- 난이도 2001-3000 (대학교 이상) ---
    {
        id: 'tf021',
        proposition: '유리수의 집합 \\(\\mathbb{Q}\\)는 완비성(Completeness)을 만족한다.',
        answer: false, // 실수의 완비성. 유리수에는 빈틈(무리수)이 있음.
        difficulty: 2050
    },
    {
        id: 'tf029',
        proposition: '괴델의 불완전성 정리에 따르면, 무모순적인 공리계 내에선 증명도 반증도 불가능한 명제가 존재한다.',
        answer: true,
        difficulty: 2200
    },
    {
        id: 'tf022',
        proposition: 'p가 5 이상의 소수일 때, \\(p^2 - 1\\)은 항상 24의 배수이다.',
        answer: true, // p²-1 = (p-1)(p+1). 연속된 세 짝수 또는 특정 꼴.
        difficulty: 2350
    },
    {
        id: 'tf026',
        proposition: '칸토어의 정리에 따르면, 자연수의 집합과 실수의 집합은 일대일 대응이 가능하다.',
        answer: false, // 불가능함 (실수는 비가산 무한집합)
        difficulty: 2450
    },
    {
        id: 'tf027',
        proposition: '정수환 \\(\\mathbb{Z}\\)의 모든 아이디얼(ideal)은 주 아이디얼(principal ideal)이다.',
        answer: true, // PID의 정의
        difficulty: 2600
    },
    {
        id: 'tf023',
        proposition: '모든 유한 차원 벡터 공간은 기저(basis)를 갖는다.',
        answer: true, // 선택 공리 없이도 증명 가능
        difficulty: 2700
    },
    {
        id: 'tf024',
        proposition: '모든 아벨군(Abelian group)은 순환군(cyclic)이다.',
        answer: false, // 반례: 클라인 4원군
        difficulty: 2800
    },
    {
        id: 'tf028',
        proposition: '위상 공간에서, 하우스도르프(Hausdorff) 공간의 모든 콤팩트 집합은 닫힌 집합이다.',
        answer: true,
        difficulty: 2900
    },
    {
        id: 'tf030',
        proposition: '타원곡선 \\(y^2 = x^3 - x\\)은 \\((0,0)\\)에서 특이점(singular point)을 갖는다.',
        answer: false, // 판별식이 0이 아니므로 비특이 타원곡선
        difficulty: 3000
    },
    {
        id: 'tf031',
        proposition: '두 삼각형의 넓이가 같으면, 두 삼각형은 합동이다.',
        answer: false, // 모양이 다를 수 있음
        difficulty: 280
    },
    {
        id: 'tf032',
        proposition: '방정식 \\(2(x-1) = 2x - 2\\)는 해가 없다.',
        answer: false, // 항상 성립하는 항등식이므로 해가 무수히 많음
        difficulty: 320
    },
    {
        id: 'tf033',
        proposition: '51은 소수이다.',
        answer: false, // 3 x 17
        difficulty: 380
    },
    {
        id: 'tf034',
        proposition: '마름모는 네 변의 길이가 모두 같은 사각형이다.',
        answer: true,
        difficulty: 110
    },
    {
        id: 'tf035',
        proposition: '음수의 제곱근은 존재하지 않는다.',
        answer: false, // 복소수(허수) 범위에서 존재
        difficulty: 450
    },
    {
        id: 'tf036',
        proposition: '$\\sqrt{(-5)^2} = -5$ 이다.',
        answer: false, // √25 = 5
        difficulty: 480
    },
    {
        id: 'tf037',
        proposition: '12와 18의 공약수 중 가장 큰 수는 6이다.',
        answer: true,
        difficulty: 300
    },
    {
        id: 'tf038',
        proposition: '두 직선이 평행하면, 두 직선의 기울기는 같다.',
        answer: true,
        difficulty: 400
    },
    {
        id: 'tf039',
        proposition: '부피가 같은 두 입체도형은 겉넓이도 같다.',
        answer: false, // 모양에 따라 다름 (예: 구와 정육면체)
        difficulty: 490
    },
    {
        id: 'tf040',
        proposition: '방정식 \\(|x-3| = -2\\)는 하나의 실근을 갖는다.',
        answer: false, // 절댓값은 음수가 될 수 없음
        difficulty: 500
    },

    // --- 난이도 501-1000 (중등 심화 함정 및 구체적 계산) ---
    {
        id: 'tf041',
        proposition: '이차방정식 \\(x^2 - 5x + 4 = 4\\)는 두 허근을 갖는다.',
        answer: false, // x(x-5)=0 이므로 실근 0, 5를 가짐
        difficulty: 550
    },
    {
        id: 'tf042',
        proposition: '모든 유리수는 유한소수로 나타낼 수 있다.',
        answer: false, // 순환소수(무한소수)가 되는 경우도 있음 (예: 1/3)
        difficulty: 600
    },
    {
        id: 'tf043',
        proposition: '두 무리수의 합은 항상 무리수이다.',
        answer: false, // 반례: (2+√3) + (2-√3) = 4
        difficulty: 700
    },
    {
        id: 'tf044',
        proposition: '삼각형의 외심은 항상 삼각형의 내부에 있다.',
        answer: false, // 둔각삼각형의 경우 외부에 있음
        difficulty: 780
    },
    {
        id: 'tf045',
        proposition: 'y가 x의 함수일 때, x값 하나에 y값 하나만 대응된다.',
        answer: true, // 함수의 정의
        difficulty: 620
    },
    {
        id: 'tf046',
        proposition: '두 수 a, b에 대하여 a < b 이면, a² < b² 이다.',
        answer: false, // a, b가 음수일 경우 반대가 됨 (예: -3 < -2 이지만 9 > 4)
        difficulty: 850
    },
    {
        id: 'tf047',
        proposition: '전체집합 U의 두 부분집합 A, B에 대하여 \\((A \\cup B)^c = A^c \\cup B^c\\)이다.',
        answer: false, // 드모르간의 법칙: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ
        difficulty: 900
    },
    {
        id: 'tf048',
        proposition: '두 삼각형이 닮음(∽) 관계이면, 넓이의 비는 대응변 길이의 비와 같다.',
        answer: false, // 넓이의 비는 길이의 비의 '제곱'과 같음
        difficulty: 820
    },
    {
        id: 'tf049',
        proposition: '이차함수 \\(y = 2(x-1)^2 + 3\\)의 그래프는 점 (2, 5)를 지난다.',
        answer: true, // x=2 대입 시, y = 2(1)²+3=5
        difficulty: 530
    },
    {
        id: 'tf050',
        proposition: '모든 평행사변형은 두 대각선의 길이가 같다.',
        answer: false, // 직사각형의 성질
        difficulty: 680
    },

    // --- 난이도 1001-2000 (고등 과정 함정 및 구체적 계산) ---
    {
        id: 'tf051',
        proposition: '\\(a > b > 0\\)일 때, \\(\\log_{10} a > \\log_{10} b\\)이다.',
        answer: true, // 밑이 1보다 큰 로그함수는 증가함수
        difficulty: 1050
    },
    {
        id: 'tf052',
        proposition: '함수 \\(f(x)\\)가 \\(x=a\\)에서 미분가능하면, \\(x=a\\)에서 연속이다.',
        answer: true,
        difficulty: 1100
    },
    {
        id: 'tf053',
        proposition: '함수 \\(f(x)\\)가 \\(x=a\\)에서 연속이면, \\(x=a\\)에서 미분가능하다.',
        answer: false, // 역은 성립하지 않음 (반례: y=|x|)
        difficulty: 1150
    },
    {
        id: 'tf054',
        proposition: '수열 \\(\\{a_n\\}\\)에 대하여 \\(\\lim_{n \\to \\infty} a_n = 0\\)이면, 급수 \\(\\sum_{n=1}^{\\infty} a_n\\)은 수렴한다.',
        answer: false, // 역은 성립하지 않음 (반례: a_n = 1/n)
        difficulty: 1300
    },
    {
        id: 'tf055',
        proposition: '두 사건 A, B가 서로 독립이면, P(A∩B) = P(A)P(B) 이다.',
        answer: true, // 독립의 정의
        difficulty: 1250
    },
    {
        id: 'tf056',
        proposition: '행렬 A의 역행렬 A⁻¹이 존재하면, A의 행렬식(determinant)은 0이다.',
        answer: false, // 행렬식이 0이 아니어야 역행렬이 존재
        difficulty: 1400
    },
    {
        id: 'tf057',
        proposition: '$\\lim_{x \\to 0} \\frac{\\sin(2x)}{x} = 1$ 이다.',
        answer: false, // 정답은 2
        difficulty: 1350
    },
    {
        id: 'tf058',
        proposition: '함수 \\(f(x) = x^3\\)은 \\(x=0\\)에서 극값을 갖는다.',
        answer: false, // f'(0)=0 이지만, 좌우에서 부호 변화가 없어 극값이 아님
        difficulty: 1500
    },
    {
        id: 'tf059',
        proposition: '모든 자연수 n에 대하여, \\(n(n+1)\\)은 짝수이다.',
        answer: true, // 연속된 두 자연수의 곱은 항상 짝수
        difficulty: 1150
    },
    {
        id: 'tf060',
        proposition: '집합 \\(\\{\\emptyset\\}\\)은 공집합이다.',
        answer: false, // 공집합을 원소로 갖는, 원소 1개짜리 집합
        difficulty: 1600
    },

    // --- 난이도 2001-3000 (대학교 이상 함정 및 구체적 계산) ---
    {
        id: 'tf061',
        proposition: '실수 위상 공간에서, 개집합(open set)들의 임의의 교집합은 개집합이다.',
        answer: false, // '유한' 교집합만 개집합임을 보장
        difficulty: 2050
    },
    {
        id: 'tf062',
        proposition: '수열 \\(x_n = (-1)^n\\)은 코시 수열(Cauchy sequence)이다.',
        answer: false, // 수렴하지 않으므로 코시 수열이 아님
        difficulty: 2150
    },
    {
        id: 'tf063',
        proposition: '체(Field)는 항상 정역(Integral Domain)이다.',
        answer: true,
        difficulty: 2300
    },
    {
        id: 'tf064',
        proposition: '정역(Integral Domain)은 항상 체(Field)이다.',
        answer: false, // 반례: 정수환 Z
        difficulty: 2350
    },
    {
        id: 'tf065',
        proposition: '함수 \\(f(z) = \\bar{z}\\) (켤레복소수)는 복소평면 전체에서 해석적(analytic)이다.',
        answer: false, // 모든 점에서 미분 불가능
        difficulty: 2500
    },
    {
        id: 'tf066',
        proposition: '군(Group) G에서 항등원은 유일하다.',
        answer: true,
        difficulty: 2100
    },
    {
        id: 'tf067',
        proposition: '다섯 번째 카마이클 수(Carmichael Number)는 2821이다.',
        answer: true,
        difficulty: 2800
    },
    {
        id: 'tf068',
        proposition: '모든 가환환(commutative ring)은 아이디얼(ideal)을 하나만 갖는다.',
        answer: false, // 일반적으로 (0)과 R 자신을 포함하여 최소 2개 이상
        difficulty: 2650
    },
    {
        id: 'tf069',
        proposition: '연속 함수에 대한 중간값 정리는 함수의 이미지가 두 점 사이의 모든 값을 포함함을 보장한다.',
        answer: true,
        difficulty: 2250
    },
    {
        id: 'tf070',
        proposition: '행렬의 고유값(eigenvalue)은 항상 실수이다.',
        answer: false, // 실행렬이라도 복소수 고유값을 가질 수 있음
        difficulty: 2450
    },
    // --- 난이도 100-500 (기초 개념 및 계산) ---
    { id: 'tf101', proposition: '두 홀수의 곱은 항상 홀수이다.', answer: true, difficulty: 150 },
    { id: 'tf102', proposition: '밑변과 높이가 같은 삼각형과 평행사변형의 넓이는 같다.', answer: false, difficulty: 200 },
    { id: 'tf103', proposition: '방정식 \\(2x + 8 = 2(x + 4)\\)의 해는 1개이다.', answer: false, difficulty: 250 },
    { id: 'tf104', proposition: '한 원에서, 가장 긴 현은 지름이다.', answer: true, difficulty: 300 },
    { id: 'tf105', proposition: '정육면체의 한 변의 길이를 2배로 늘리면, 부피는 8배가 된다.', answer: true, difficulty: 350 },
    { id: 'tf106', proposition: '\\(\\sqrt{2} + \\sqrt{3} = \\sqrt{5}\\) 이다.', answer: false, difficulty: 400 },
    { id: 'tf107', proposition: '서로 다른 두 점은 항상 하나의 직선을 결정한다.', answer: true, difficulty: 450 },
    { id: 'tf108', proposition: '10% 소금물 100g과 20% 소금물 100g을 섞으면 15% 소금물 200g이 된다.', answer: true, difficulty: 500 },

    // --- 난이도 501-1000 (중등 심화) ---
    { id: 'tf109', proposition: '일차함수 \\(y = 3x - 2\\)의 그래프는 점 (-1, 1)을 지난다.', answer: false, difficulty: 550 },
    { id: 'tf110', proposition: '어떤 자연수의 약수의 개수가 홀수이면, 그 자연수는 제곱수이다.', answer: true, difficulty: 600 },
    { id: 'tf111', proposition: '이등변삼각형의 두 밑각의 크기는 같다.', answer: true, difficulty: 650 },
    { id: 'tf112', proposition: '이차방정식 \\(x^2 - 6x + 9 = 0\\)은 서로 다른 두 실근을 갖는다.', answer: false, difficulty: 700 },
    { id: 'tf113', proposition: '1부터 6까지 적힌 주사위 한 개를 던질 때, 3의 배수가 나올 확률은 1/2이다.', answer: false, difficulty: 750 },
    { id: 'tf114', proposition: '모든 실수는 유리수 또는 무리수이다.', answer: true, difficulty: 800 },
    { id: 'tf115', proposition: '두 직선이 한 점에서 만나면, 맞꼭지각의 크기는 항상 서로 같다.', answer: true, difficulty: 850 },
    { id: 'tf116', proposition: '두 변의 길이가 각각 3, 4인 삼각형의 나머지 한 변의 길이는 5이다.', answer: false, difficulty: 900 },
    { id: 'tf117', proposition: '두 수의 최소공배수는 항상 두 수의 곱보다 작거나 같다.', answer: true, difficulty: 950 },
    { id: 'tf118', proposition: '원주율(π)은 유리수이다.', answer: false, difficulty: 1000 },

    // --- 난이도 1001-2000 (고등 과정) ---
    { id: 'tf119', proposition: '함수 \\(f(x) = \\frac{1}{x-1}\\)은 \\(x=1\\)에서 불연속이다.', answer: true, difficulty: 1050 },
    { id: 'tf120', proposition: '모든 함수는 역함수를 갖는다.', answer: false, difficulty: 1100 },
    { id: 'tf121', proposition: '$\\log_a{x} + \\log_a{y} = \\log_a{(x+y)}$ 이다.', answer: false, difficulty: 1150 },
    { id: 'tf122', proposition: '집합 {1, 2, 3}에서 집합 {a, b}로의 함수 중 전사함수(surjective)는 존재한다.', answer: true, difficulty: 1250 },
    { id: 'tf123', proposition: '다항함수 \\(f(x)\\)에 대하여 \\(f(a)=0\\)이면, \\(f(x)\\)는 \\((x-a)\\)로 나누어 떨어진다.', answer: true, difficulty: 1300 },
    { id: 'tf124', proposition: '$\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$ 이다.', answer: true, difficulty: 1350 },
    { id: 'tf125', proposition: '모든 실수 x에 대하여 \\(\\sin^2{x} + \\cos^2{x} = 1\\)이다.', answer: true, difficulty: 1400 },
    { id: 'tf126', proposition: '$\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = 2$ 이다.', answer: false, difficulty: 1500 },
    { id: 'tf127', proposition: '벡터의 내적은 교환법칙을 만족한다. (a · b = b · a)', answer: true, difficulty: 1600 },
    { id: 'tf128', proposition: 'nCr = nCn-r 이다.', answer: true, difficulty: 1700 },
    { id: 'tf129', proposition: '닫힌 구간 [a, b]에서 연속인 함수는 그 구간에서 항상 최댓값과 최솟값을 갖는다.', answer: true, difficulty: 1800 },
    { id: 'tf130', proposition: '함수 y = tan(x)의 주기는 π이다.', answer: true, difficulty: 1900 },
    { id: 'tf131', proposition: '급수 \\(\\sum_{n=1}^{\\infty} \\frac{1}{\\sqrt{n}}\\)은 수렴한다.', answer: false, difficulty: 2000 },

    // --- 난이도 2001-3000 (대학교 이상) ---
    { id: 'tf132', proposition: '실수 집합 \\(\\mathbb{R}\\)은 가산집합(countable set)이다.', answer: false, difficulty: 2100 },
    { id: 'tf133', proposition: '정수환 \\(\\mathbb{Z}\\)에서 모든 소 아이디얼(prime ideal)은 극대 아이디얼(maximal ideal)이다.', answer: true, difficulty: 2200 },
    { id: 'tf134', proposition: '코시-슈바르츠 부등식은 유클리드 공간에서만 성립한다.', answer: false, difficulty: 2300 },
    { id: 'tf135', proposition: '함수 \\(f(x) = e^{-x^2}\\)을 \\((-\\infty, \\infty)\\)에서 적분한 값은 \\(\\sqrt{\\pi}\\)이다 (가우스 적분).', answer: true, difficulty: 2400 },
    { id: 'tf136', proposition: '모든 유한군은 대칭군(symmetric group)의 부분군과 동형(isomorphic)이다 (케일리의 정리).', answer: true, difficulty: 2500 },
    { id: 'tf137', proposition: '위상동형사상(homeomorphism)에 의해 보존되는 성질을 위상적 성질이라고 한다.', answer: true, difficulty: 2600 },
    { id: 'tf138', proposition: '복소평면에서 해석적인 함수(analytic function)의 도함수는 항상 해석적이다.', answer: true, difficulty: 2700 },
    { id: 'tf139', proposition: '체(field)의 표수(characteristic)는 항상 0 또는 소수이다.', answer: true, difficulty: 2850 },
    { id: 'tf140', proposition: 'n차 정사각행렬 A가 가역행렬일 필요충분조건은 det(A) = 1이다.', answer: false, difficulty: 2950 }

];

// --- 고스트 기록 데이터 (총 30개) ---
// 3가지 유형으로 구성됩니다.
// 1. 첫 시도에 정답 (10명)
// 2. 첫 시도 오답, 두 번째 시도에 정답 (10명)
// 3. 두 번 모두 오답 (10명)
export const arenaGhostRecords = [
    {
        problemId: "p122", nickname: "수학의신", rating: 2600,
        firstAttemptTime: 0.1, firstAttemptIsCorrect: true,
        timeTaken: 0.1, isCorrect: true
    },
    {
        problemId: "p46", nickname: "상수의노예", rating: 1836,
        firstAttemptTime: 14.0, firstAttemptIsCorrect: true,
        timeTaken: 14.0, isCorrect: true
    },
    {
        problemId: "p123", nickname: "수포자1호", rating: 1977,
        firstAttemptTime: 14.1, firstAttemptIsCorrect: true,
        timeTaken: 14.1, isCorrect: true
    },
    {
        problemId: "p104", nickname: "고등러너", rating: 1581,
        firstAttemptTime: 20.6, firstAttemptIsCorrect: false,
        timeTaken: 28.5, isCorrect: false
    },
    {
        problemId: "p55", nickname: "수포자1호", rating: 1006,
        firstAttemptTime: 52.6, firstAttemptIsCorrect: true,
        timeTaken: 52.6, isCorrect: true
    },
    {
        problemId: "p103", nickname: "그래프헌터", rating: 813,
        firstAttemptTime: 52.4, firstAttemptIsCorrect: true,
        timeTaken: 52.4, isCorrect: true
    },
    {
        problemId: "p87", nickname: "그래프헌터", rating: 2214,
        firstAttemptTime: 7.3, firstAttemptIsCorrect: true,
        timeTaken: 7.3, isCorrect: true
    },
    {
        problemId: "p74", nickname: "수포자1호", rating: 2346,
        firstAttemptTime: 6.7, firstAttemptIsCorrect: true,
        timeTaken: 6.7, isCorrect: true
    },
    {
        problemId: "p20", nickname: "루트의혼", rating: 2339,
        firstAttemptTime: 9.2, firstAttemptIsCorrect: false,
        timeTaken: 15.7, isCorrect: true
    },
    {
        problemId: "p2", nickname: "절댓값러버", rating: 1360,
        firstAttemptTime: 39.8, firstAttemptIsCorrect: false,
        timeTaken: 48.0, isCorrect: false
    },
    {
        problemId: "p56", nickname: "루트의혼", rating: 1567,
        firstAttemptTime: 24.0, firstAttemptIsCorrect: false,
        timeTaken: 31.9, isCorrect: true
    },
    {
        problemId: "p116", nickname: "그래디언트팬", rating: 948,
        firstAttemptTime: 52.2, firstAttemptIsCorrect: false,
        timeTaken: 59.9, isCorrect: false
    },
    {
        problemId: "p8", nickname: "함수왕국", rating: 1448,
        firstAttemptTime: 44.1, firstAttemptIsCorrect: false,
        timeTaken: 52.0, isCorrect: false
    },
    {
        problemId: "p115", nickname: "그래디언트팬", rating: 2390,
        firstAttemptTime: 6.6, firstAttemptIsCorrect: true,
        timeTaken: 6.6, isCorrect: true
    },
    {
        problemId: "p126", nickname: "상수의노예", rating: 1904,
        firstAttemptTime: 14.2, firstAttemptIsCorrect: true,
        timeTaken: 14.2, isCorrect: true
    },
    {
        problemId: "p59", nickname: "그래디언트팬", rating: 1460,
        firstAttemptTime: 42.5, firstAttemptIsCorrect: false,
        timeTaken: 51.2, isCorrect: true
    },
    {
        problemId: "p109", nickname: "상수의노예", rating: 839,
        firstAttemptTime: 56.0, firstAttemptIsCorrect: true,
        timeTaken: 56.0, isCorrect: true
    },
    {
        problemId: "p5", nickname: "이과생김씨", rating: 1252,
        firstAttemptTime: 36.7, firstAttemptIsCorrect: false,
        timeTaken: 44.2, isCorrect: false
    },
    {
        problemId: "p38", nickname: "이과생김씨", rating: 1718,
        firstAttemptTime: 21.2, firstAttemptIsCorrect: true,
        timeTaken: 21.2, isCorrect: true
    },
    {
        problemId: "p11", nickname: "그래프헌터", rating: 1494,
        firstAttemptTime: 44.6, firstAttemptIsCorrect: true,
        timeTaken: 44.6, isCorrect: true
    },
    {
        problemId: "p44", nickname: "수포자1호", rating: 1657,
        firstAttemptTime: 21.3, firstAttemptIsCorrect: true,
        timeTaken: 21.3, isCorrect: true
    },
    {
        problemId: "p76", nickname: "함수왕국", rating: 1740,
        firstAttemptTime: 23.9, firstAttemptIsCorrect: true,
        timeTaken: 23.9, isCorrect: true
    },
    {
        problemId: "p122", nickname: "코사인도둑", rating: 1503,
        firstAttemptTime: 24.3, firstAttemptIsCorrect: true,
        timeTaken: 24.3, isCorrect: true
    },
    {
        problemId: "p118", nickname: "루트의혼", rating: 1268,
        firstAttemptTime: 40.7, firstAttemptIsCorrect: false,
        timeTaken: 48.8, isCorrect: false
    },
    {
        problemId: "p90", nickname: "고등러너", rating: 2342,
        firstAttemptTime: 6.4, firstAttemptIsCorrect: false,
        timeTaken: 15.3, isCorrect: false
    },
    {
        problemId: "p67", nickname: "절댓값러버", rating: 1645,
        firstAttemptTime: 23.3, firstAttemptIsCorrect: false,
        timeTaken: 31.2, isCorrect: false
    },
    {
        problemId: "p41", nickname: "그래프헌터", rating: 2147,
        firstAttemptTime: 14.5, firstAttemptIsCorrect: false,
        timeTaken: 23.3, isCorrect: false
    },
    {
        problemId: "p72", nickname: "수포자1호", rating: 894,
        firstAttemptTime: 54.2, firstAttemptIsCorrect: false,
        timeTaken: 59.9, isCorrect: false
    },
    {
        problemId: "p62", nickname: "절댓값러버", rating: 1408,
        firstAttemptTime: 44.9, firstAttemptIsCorrect: false,
        timeTaken: 53.1, isCorrect: true
    },
    {
        problemId: "p31", nickname: "그래디언트팬", rating: 2343,
        firstAttemptTime: 7.1, firstAttemptIsCorrect: true,
        timeTaken: 7.1, isCorrect: true
    },
    {
        problemId: "p65", nickname: "코사인도둑", rating: 1024,
        firstAttemptTime: 50.8, firstAttemptIsCorrect: true,
        timeTaken: 50.8, isCorrect: true
    },
    {
        problemId: "p51", nickname: "함수왕국", rating: 2293,
        firstAttemptTime: 23.5, firstAttemptIsCorrect: false,
        timeTaken: 44.7, isCorrect: true
    },
    {
        problemId: "p106", nickname: "절댓값러버", rating: 1599,
        firstAttemptTime: 45.9, firstAttemptIsCorrect: true,
        timeTaken: 45.9, isCorrect: true
    },
    {
        problemId: "p15", nickname: "코사인도둑", rating: 814,
        firstAttemptTime: 56.5, firstAttemptIsCorrect: true,
        timeTaken: 56.5, isCorrect: true
    },
    {
        problemId: "p60", nickname: "미적최강", rating: 1028,
        firstAttemptTime: 55.2, firstAttemptIsCorrect: true,
        timeTaken: 55.2, isCorrect: true
    },
    {
        problemId: "p90", nickname: "그래프헌터", rating: 814,
        firstAttemptTime: 53.8, firstAttemptIsCorrect: true,
        timeTaken: 53.8, isCorrect: true
    },
    {
        problemId: "p105", nickname: "수학야수", rating: 2316,
        firstAttemptTime: 20.8, firstAttemptIsCorrect: true,
        timeTaken: 20.8, isCorrect: true
    },
    {
        problemId: "p71", nickname: "이과생김씨", rating: 2330,
        firstAttemptTime: 24.6, firstAttemptIsCorrect: true,
        timeTaken: 24.6, isCorrect: true
    },
    {
        problemId: "p9", nickname: "고등러너", rating: 1994,
        firstAttemptTime: 32.3, firstAttemptIsCorrect: true,
        timeTaken: 32.3, isCorrect: true
    },
    {
        problemId: "p65", nickname: "그래프헌터", rating: 2388,
        firstAttemptTime: 23.9, firstAttemptIsCorrect: false,
        timeTaken: 38.1, isCorrect: true
    },
    {
        problemId: "p34", nickname: "함수왕국", rating: 1640,
        firstAttemptTime: 46.1, firstAttemptIsCorrect: false,
        timeTaken: 57.5, isCorrect: true
    },
    {
        problemId: "p111", nickname: "이과생김씨", rating: 1065,
        firstAttemptTime: 54.0, firstAttemptIsCorrect: false,
        timeTaken: 60.0, isCorrect: false
    },
    {
        problemId: "p57", nickname: "미적최강", rating: 1147,
        firstAttemptTime: 53.9, firstAttemptIsCorrect: true,
        timeTaken: 53.9, isCorrect: true
    },
    {
        problemId: "p91", nickname: "절댓값러버", rating: 2396,
        firstAttemptTime: 3.1, firstAttemptIsCorrect: false,
        timeTaken: 8.6, isCorrect: true
    },
    {
        problemId: "p72", nickname: "그래디언트팬", rating: 853,
        firstAttemptTime: 53.6, firstAttemptIsCorrect: false,
        timeTaken: 60.0, isCorrect: true
    },
    {
        problemId: "p12", nickname: "그래프헌터", rating: 1954,
        firstAttemptTime: 33.8, firstAttemptIsCorrect: true,
        timeTaken: 33.8, isCorrect: true
    },
    {
        problemId: "p32", nickname: "루트의혼", rating: 990,
        firstAttemptTime: 54.3, firstAttemptIsCorrect: true,
        timeTaken: 54.3, isCorrect: true
    },
    {
        problemId: "p125", nickname: "절댓값러버", rating: 1283,
        firstAttemptTime: 54.0, firstAttemptIsCorrect: false,
        timeTaken: 60.0, isCorrect: false
    },
    {
        problemId: "p12", nickname: "지수로사는법", rating: 1986,
        firstAttemptTime: 33.4, firstAttemptIsCorrect: true,
        timeTaken: 33.4, isCorrect: true
    },
    {
        problemId: "p26", nickname: "코사인도둑", rating: 2306,
        firstAttemptTime: 22.8, firstAttemptIsCorrect: true,
        timeTaken: 22.8, isCorrect: true
    },
    {
        problemId: "p18", nickname: "수포자1호", rating: 1004,
        firstAttemptTime: 54.6, firstAttemptIsCorrect: true,
        timeTaken: 54.6, isCorrect: true
    },
    {
        problemId: "p24", nickname: "그래디언트팬", rating: 809,
        firstAttemptTime: 55.4, firstAttemptIsCorrect: true,
        timeTaken: 55.4, isCorrect: true
    },
    {
        problemId: "p34", nickname: "고등러너", rating: 957,
        firstAttemptTime: 53.8, firstAttemptIsCorrect: true,
        timeTaken: 53.8, isCorrect: true
    },
    {
        problemId: "p85", nickname: "상수의노예", rating: 1618,
        firstAttemptTime: 49.1, firstAttemptIsCorrect: true,
        timeTaken: 49.1, isCorrect: true
    },
    {
        problemId: "p1", nickname: "그래프헌터", rating: 2213,
        firstAttemptTime: 27.3, firstAttemptIsCorrect: false,
        timeTaken: 51.3, isCorrect: true
    },
    {
        problemId: "p122", nickname: "절댓값러버", rating: 1343,
        firstAttemptTime: 56.2, firstAttemptIsCorrect: true,
        timeTaken: 56.2, isCorrect: true
    },
    {
        problemId: "p114", nickname: "상수의노예", rating: 1257,
        firstAttemptTime: 54.0, firstAttemptIsCorrect: false,
        timeTaken: 60.0, isCorrect: true
    },
    {
        problemId: "p118", nickname: "지수로사는법", rating: 2059,
        firstAttemptTime: 30.7, firstAttemptIsCorrect: true,
        timeTaken: 30.7, isCorrect: true
    },
    {
        problemId: "p6", nickname: "수포자1호", rating: 2229,
        firstAttemptTime: 25.6, firstAttemptIsCorrect: true,
        timeTaken: 25.6, isCorrect: true
    },
    {
        problemId: "p12", nickname: "고등러너", rating: 1622,
        firstAttemptTime: 43.3, firstAttemptIsCorrect: false,
        timeTaken: 50.7, isCorrect: true
    },
    {
        problemId: "p5", nickname: "지수로사는법", rating: 979,
        firstAttemptTime: 54.0, firstAttemptIsCorrect: false,
        timeTaken: 60.0, isCorrect: true
    },
    { problemId: "p17", nickname: "그래프헌터", rating: 2310, firstAttemptTime: 6.2, firstAttemptIsCorrect: true, timeTaken: 6.2, isCorrect: true },
    { problemId: "p29", nickname: "루트의혼", rating: 2210, firstAttemptTime: 8.5, firstAttemptIsCorrect: true, timeTaken: 8.5, isCorrect: true },
    { problemId: "p48", nickname: "절댓값러버", rating: 2150, firstAttemptTime: 10.9, firstAttemptIsCorrect: true, timeTaken: 10.9, isCorrect: true },
    { problemId: "p33", nickname: "수포자1호", rating: 2030, firstAttemptTime: 11.7, firstAttemptIsCorrect: false, timeTaken: 21.4, isCorrect: true },
    { problemId: "p92", nickname: "상수의노예", rating: 1970, firstAttemptTime: 13.2, firstAttemptIsCorrect: true, timeTaken: 13.2, isCorrect: true },
    { problemId: "p18", nickname: "고등러너", rating: 1860, firstAttemptTime: 15.1, firstAttemptIsCorrect: true, timeTaken: 15.1, isCorrect: true },
    { problemId: "p36", nickname: "그래디언트팬", rating: 1790, firstAttemptTime: 16.9, firstAttemptIsCorrect: false, timeTaken: 26.3, isCorrect: false },
    { problemId: "p81", nickname: "함수왕국", rating: 1740, firstAttemptTime: 17.8, firstAttemptIsCorrect: true, timeTaken: 17.8, isCorrect: true },
    { problemId: "p62", nickname: "루트의혼", rating: 1690, firstAttemptTime: 18.6, firstAttemptIsCorrect: false, timeTaken: 29.5, isCorrect: true },
    { problemId: "p13", nickname: "코사인도둑", rating: 1580, firstAttemptTime: 21.1, firstAttemptIsCorrect: true, timeTaken: 21.1, isCorrect: true },
    { problemId: "p50", nickname: "절댓값러버", rating: 1520, firstAttemptTime: 22.8, firstAttemptIsCorrect: false, timeTaken: 33.6, isCorrect: true },
    { problemId: "p71", nickname: "수포자1호", rating: 1490, firstAttemptTime: 23.5, firstAttemptIsCorrect: true, timeTaken: 23.5, isCorrect: true },
    { problemId: "p30", nickname: "그래디언트팬", rating: 1450, firstAttemptTime: 24.4, firstAttemptIsCorrect: false, timeTaken: 34.9, isCorrect: false },
    { problemId: "p94", nickname: "상수의노예", rating: 1410, firstAttemptTime: 27.0, firstAttemptIsCorrect: true, timeTaken: 27.0, isCorrect: true },
    { problemId: "p53", nickname: "함수왕국", rating: 1380, firstAttemptTime: 28.3, firstAttemptIsCorrect: false, timeTaken: 39.2, isCorrect: false },
    { problemId: "p99", nickname: "그래프헌터", rating: 1340, firstAttemptTime: 30.6, firstAttemptIsCorrect: false, timeTaken: 40.1, isCorrect: true },
    { problemId: "p4", nickname: "코사인도둑", rating: 1300, firstAttemptTime: 32.5, firstAttemptIsCorrect: true, timeTaken: 32.5, isCorrect: true },
    { problemId: "p88", nickname: "고등러너", rating: 1260, firstAttemptTime: 33.7, firstAttemptIsCorrect: false, timeTaken: 45.0, isCorrect: false },
    { problemId: "p57", nickname: "절댓값러버", rating: 1200, firstAttemptTime: 36.2, firstAttemptIsCorrect: false, timeTaken: 46.5, isCorrect: true },
    { problemId: "p7", nickname: "루트의혼", rating: 1150, firstAttemptTime: 38.4, firstAttemptIsCorrect: true, timeTaken: 38.4, isCorrect: true },
    { problemId: "p25", nickname: "이과생김씨", rating: 1120, firstAttemptTime: 40.7, firstAttemptIsCorrect: false, timeTaken: 51.2, isCorrect: true },
    { problemId: "p67", nickname: "수포자1호", rating: 1070, firstAttemptTime: 42.3, firstAttemptIsCorrect: false, timeTaken: 54.6, isCorrect: false },
    { problemId: "p14", nickname: "그래디언트팬", rating: 1030, firstAttemptTime: 43.8, firstAttemptIsCorrect: true, timeTaken: 43.8, isCorrect: true },
    { problemId: "p91", nickname: "고등러너", rating: 980, firstAttemptTime: 46.0, firstAttemptIsCorrect: false, timeTaken: 56.3, isCorrect: false },
    { problemId: "p78", nickname: "함수왕국", rating: 950, firstAttemptTime: 47.6, firstAttemptIsCorrect: true, timeTaken: 47.6, isCorrect: true },
    { problemId: "p66", nickname: "그래프헌터", rating: 920, firstAttemptTime: 48.3, firstAttemptIsCorrect: false, timeTaken: 58.4, isCorrect: true },
    { problemId: "p84", nickname: "상수의노예", rating: 890, firstAttemptTime: 49.9, firstAttemptIsCorrect: false, timeTaken: 59.5, isCorrect: false },
    { problemId: "p3", nickname: "절댓값러버", rating: 860, firstAttemptTime: 50.7, firstAttemptIsCorrect: true, timeTaken: 50.7, isCorrect: true },
    { problemId: "p24", nickname: "코사인도둑", rating: 830, firstAttemptTime: 52.2, firstAttemptIsCorrect: false, timeTaken: 59.3, isCorrect: false },
    { problemId: "p6", nickname: "이과생김씨", rating: 810, firstAttemptTime: 53.9, firstAttemptIsCorrect: false, timeTaken: 59.9, isCorrect: true },
    { problemId: "p5", nickname: "수학광", rating: 2305, firstAttemptTime: 7.9, firstAttemptIsCorrect: true, timeTaken: 7.9, isCorrect: true },
    { problemId: "p12", nickname: "코사인마스터", rating: 2280, firstAttemptTime: 6.8, firstAttemptIsCorrect: true, timeTaken: 6.8, isCorrect: true },
    { problemId: "p19", nickname: "함수왕", rating: 2215, firstAttemptTime: 8.1, firstAttemptIsCorrect: false, timeTaken: 19.7, isCorrect: true },
    { problemId: "p23", nickname: "삼각김밥", rating: 2150, firstAttemptTime: 9.4, firstAttemptIsCorrect: true, timeTaken: 9.4, isCorrect: true },
    { problemId: "p28", nickname: "절댓값전사", rating: 2120, firstAttemptTime: 8.8, firstAttemptIsCorrect: false, timeTaken: 21.0, isCorrect: false },
    { problemId: "p31", nickname: "벡터마스터", rating: 2045, firstAttemptTime: 11.3, firstAttemptIsCorrect: true, timeTaken: 11.3, isCorrect: true },
    { problemId: "p38", nickname: "미분전문가", rating: 1995, firstAttemptTime: 12.5, firstAttemptIsCorrect: false, timeTaken: 22.9, isCorrect: true },
    { problemId: "p44", nickname: "적분왕", rating: 1910, firstAttemptTime: 14.2, firstAttemptIsCorrect: true, timeTaken: 14.2, isCorrect: true },
    { problemId: "p49", nickname: "수학천재", rating: 1860, firstAttemptTime: 15.7, firstAttemptIsCorrect: false, timeTaken: 37.1, isCorrect: true },
    { problemId: "p55", nickname: "함수광", rating: 1790, firstAttemptTime: 16.9, firstAttemptIsCorrect: true, timeTaken: 16.9, isCorrect: true },
    { problemId: "p59", nickname: "복소수의달인", rating: 1710, firstAttemptTime: 18.5, firstAttemptIsCorrect: false, timeTaken: 25.6, isCorrect: true },
    { problemId: "p63", nickname: "미적분광", rating: 1680, firstAttemptTime: 19.8, firstAttemptIsCorrect: true, timeTaken: 19.8, isCorrect: true },
    { problemId: "p68", nickname: "벡터도사", rating: 1605, firstAttemptTime: 21.3, firstAttemptIsCorrect: false, timeTaken: 30.0, isCorrect: false },
    { problemId: "p70", nickname: "수학러", rating: 1560, firstAttemptTime: 23.4, firstAttemptIsCorrect: true, timeTaken: 23.4, isCorrect: true },
    { problemId: "p74", nickname: "삼각함수고수", rating: 1495, firstAttemptTime: 24.8, firstAttemptIsCorrect: false, timeTaken: 35.7, isCorrect: true },
    { problemId: "p77", nickname: "확률전문가", rating: 1460, firstAttemptTime: 25.7, firstAttemptIsCorrect: true, timeTaken: 25.7, isCorrect: true },
    { problemId: "p80", nickname: "집합고수", rating: 1420, firstAttemptTime: 27.2, firstAttemptIsCorrect: false, timeTaken: 38.8, isCorrect: false },
    { problemId: "p85", nickname: "수학천재", rating: 1360, firstAttemptTime: 29.5, firstAttemptIsCorrect: true, timeTaken: 29.5, isCorrect: true },
    { problemId: "p87", nickname: "고등러너", rating: 1310, firstAttemptTime: 30.6, firstAttemptIsCorrect: false, timeTaken: 44.9, isCorrect: true },
    { problemId: "p90", nickname: "적분광", rating: 1275, firstAttemptTime: 32.0, firstAttemptIsCorrect: true, timeTaken: 32.0, isCorrect: true },
    { problemId: "p93", nickname: "벡터달인", rating: 1240, firstAttemptTime: 33.3, firstAttemptIsCorrect: false, timeTaken: 42.0, isCorrect: false },
    { problemId: "p95", nickname: "삼각함수달인", rating: 1185, firstAttemptTime: 35.1, firstAttemptIsCorrect: true, timeTaken: 35.1, isCorrect: true },
    { problemId: "p97", nickname: "복소수마스터", rating: 1150, firstAttemptTime: 37.0, firstAttemptIsCorrect: false, timeTaken: 49.1, isCorrect: true },
    { problemId: "p98", nickname: "수학러", rating: 1120, firstAttemptTime: 37.8, firstAttemptIsCorrect: true, timeTaken: 37.8, isCorrect: true },
    { problemId: "p100", nickname: "그래프헌터", rating: 1100, firstAttemptTime: 39.2, firstAttemptIsCorrect: false, timeTaken: 50.7, isCorrect: false },
    { problemId: "p102", nickname: "적분고수", rating: 1050, firstAttemptTime: 40.6, firstAttemptIsCorrect: true, timeTaken: 40.6, isCorrect: true },
    { problemId: "p107", nickname: "미적분고수", rating: 1005, firstAttemptTime: 42.1, firstAttemptIsCorrect: false, timeTaken: 52.3, isCorrect: true },
    { problemId: "p110", nickname: "함수천재", rating: 970, firstAttemptTime: 43.8, firstAttemptIsCorrect: true, timeTaken: 43.8, isCorrect: true },
    { problemId: "p113", nickname: "벡터달인", rating: 930, firstAttemptTime: 45.0, firstAttemptIsCorrect: false, timeTaken: 54.0, isCorrect: false },
    { problemId: "p118", nickname: "확률전문가", rating: 890, firstAttemptTime: 47.3, firstAttemptIsCorrect: true, timeTaken: 47.3, isCorrect: true },
    { problemId: "p6", nickname: "수학천재", rating: 2370, firstAttemptTime: 6.1, firstAttemptIsCorrect: true, timeTaken: 6.1, isCorrect: true },
    { problemId: "p9", nickname: "삼각함수달인", rating: 2330, firstAttemptTime: 5.3, firstAttemptIsCorrect: false, timeTaken: 14.0, isCorrect: true },
    { problemId: "p13", nickname: "함수고수", rating: 2285, firstAttemptTime: 7.0, firstAttemptIsCorrect: true, timeTaken: 7.0, isCorrect: true },
    { problemId: "p17", nickname: "벡터달인", rating: 2210, firstAttemptTime: 7.8, firstAttemptIsCorrect: false, timeTaken: 20.5, isCorrect: false },
    { problemId: "p21", nickname: "적분고수", rating: 2175, firstAttemptTime: 8.3, firstAttemptIsCorrect: true, timeTaken: 8.3, isCorrect: true },
    { problemId: "p26", nickname: "복소수왕", rating: 2100, firstAttemptTime: 9.5, firstAttemptIsCorrect: false, timeTaken: 25.3, isCorrect: true },
    { problemId: "p33", nickname: "수학마니아", rating: 2055, firstAttemptTime: 10.8, firstAttemptIsCorrect: true, timeTaken: 10.8, isCorrect: true },
    { problemId: "p36", nickname: "미적분달인", rating: 2005, firstAttemptTime: 11.7, firstAttemptIsCorrect: false, timeTaken: 22.6, isCorrect: true },
    { problemId: "p42", nickname: "그래프달인", rating: 1930, firstAttemptTime: 12.9, firstAttemptIsCorrect: true, timeTaken: 12.9, isCorrect: true },
    { problemId: "p48", nickname: "벡터천재", rating: 1875, firstAttemptTime: 14.3, firstAttemptIsCorrect: false, timeTaken: 33.5, isCorrect: false },
    { problemId: "p53", nickname: "확률고수", rating: 1800, firstAttemptTime: 15.6, firstAttemptIsCorrect: true, timeTaken: 15.6, isCorrect: true },
    { problemId: "p58", nickname: "수학천재", rating: 1745, firstAttemptTime: 17.1, firstAttemptIsCorrect: false, timeTaken: 28.4, isCorrect: true },
    { problemId: "p62", nickname: "삼각함수왕", rating: 1680, firstAttemptTime: 18.3, firstAttemptIsCorrect: true, timeTaken: 18.3, isCorrect: true },
    { problemId: "p66", nickname: "복소수고수", rating: 1620, firstAttemptTime: 20.2, firstAttemptIsCorrect: false, timeTaken: 31.0, isCorrect: false },
    { problemId: "p71", nickname: "미적분천재", rating: 1575, firstAttemptTime: 21.5, firstAttemptIsCorrect: true, timeTaken: 21.5, isCorrect: true },
    { problemId: "p75", nickname: "적분고수", rating: 1510, firstAttemptTime: 22.9, firstAttemptIsCorrect: false, timeTaken: 36.3, isCorrect: true },
    { problemId: "p78", nickname: "함수마스터", rating: 1465, firstAttemptTime: 24.1, firstAttemptIsCorrect: true, timeTaken: 24.1, isCorrect: true },
    { problemId: "p83", nickname: "삼각함수고수", rating: 1410, firstAttemptTime: 25.9, firstAttemptIsCorrect: false, timeTaken: 39.2, isCorrect: false },
    { problemId: "p86", nickname: "수학광", rating: 1355, firstAttemptTime: 27.0, firstAttemptIsCorrect: true, timeTaken: 27.0, isCorrect: true },
    { problemId: "p89", nickname: "벡터천재", rating: 1300, firstAttemptTime: 28.5, firstAttemptIsCorrect: false, timeTaken: 42.7, isCorrect: true },
    { problemId: "p92", nickname: "미적분마스터", rating: 1255, firstAttemptTime: 29.8, firstAttemptIsCorrect: true, timeTaken: 29.8, isCorrect: true },
    { problemId: "p94", nickname: "복소수달인", rating: 1205, firstAttemptTime: 31.2, firstAttemptIsCorrect: false, timeTaken: 47.1, isCorrect: false },
    { problemId: "p96", nickname: "확률전문가", rating: 1160, firstAttemptTime: 32.7, firstAttemptIsCorrect: true, timeTaken: 32.7, isCorrect: true },
    { problemId: "p99", nickname: "수학광", rating: 1125, firstAttemptTime: 34.0, firstAttemptIsCorrect: false, timeTaken: 48.8, isCorrect: true },
    { problemId: "p101", nickname: "삼각함수달인", rating: 1080, firstAttemptTime: 35.2, firstAttemptIsCorrect: true, timeTaken: 35.2, isCorrect: true },
    { problemId: "p103", nickname: "적분왕", rating: 1045, firstAttemptTime: 36.7, firstAttemptIsCorrect: false, timeTaken: 50.9, isCorrect: false },
    { problemId: "p106", nickname: "함수달인", rating: 1000, firstAttemptTime: 38.1, firstAttemptIsCorrect: true, timeTaken: 38.1, isCorrect: true },
    { problemId: "p108", nickname: "벡터광", rating: 960, firstAttemptTime: 39.5, firstAttemptIsCorrect: false, timeTaken: 53.0, isCorrect: true },
    { problemId: "p111", nickname: "복소수마스터", rating: 920, firstAttemptTime: 41.0, firstAttemptIsCorrect: true, timeTaken: 41.0, isCorrect: true },
    { problemId: "p115", nickname: "미적분고수", rating: 890, firstAttemptTime: 42.5, firstAttemptIsCorrect: false, timeTaken: 56.2, isCorrect: false },
    { problemId: "p119", nickname: "수학천재", rating: 860, firstAttemptTime: 44.3, firstAttemptIsCorrect: true, timeTaken: 44.3, isCorrect: true },
    { problemId: "p7", nickname: "BlueCat92", rating: 820, firstAttemptTime: 55.2, firstAttemptIsCorrect: false, timeTaken: 59.0, isCorrect: true },
    { problemId: "p11", nickname: "SunnyDayz", rating: 870, firstAttemptTime: 51.7, firstAttemptIsCorrect: true, timeTaken: 51.7, isCorrect: true },
    { problemId: "p14", nickname: "PixelPanda", rating: 900, firstAttemptTime: 47.6, firstAttemptIsCorrect: false, timeTaken: 55.0, isCorrect: false },
    { problemId: "p19", nickname: "LazyFox", rating: 940, firstAttemptTime: 43.9, firstAttemptIsCorrect: true, timeTaken: 43.9, isCorrect: true },
    { problemId: "p22", nickname: "EchoWave", rating: 980, firstAttemptTime: 40.3, firstAttemptIsCorrect: false, timeTaken: 49.1, isCorrect: true },
    { problemId: "p27", nickname: "NightOwl", rating: 1030, firstAttemptTime: 37.0, firstAttemptIsCorrect: true, timeTaken: 37.0, isCorrect: true },
    { problemId: "p31", nickname: "SilverLynx", rating: 1075, firstAttemptTime: 33.7, firstAttemptIsCorrect: false, timeTaken: 43.0, isCorrect: false },
    { problemId: "p35", nickname: "CrimsonVibe", rating: 1110, firstAttemptTime: 30.6, firstAttemptIsCorrect: true, timeTaken: 30.6, isCorrect: true },
    { problemId: "p38", nickname: "GoldenBee", rating: 1150, firstAttemptTime: 27.9, firstAttemptIsCorrect: false, timeTaken: 38.8, isCorrect: true },
    { problemId: "p43", nickname: "FrostyWolf", rating: 1185, firstAttemptTime: 25.4, firstAttemptIsCorrect: true, timeTaken: 25.4, isCorrect: true },
    { problemId: "p47", nickname: "TurboJet", rating: 1220, firstAttemptTime: 23.0, firstAttemptIsCorrect: false, timeTaken: 34.1, isCorrect: false },
    { problemId: "p50", nickname: "PixelGhost", rating: 1255, firstAttemptTime: 20.8, firstAttemptIsCorrect: true, timeTaken: 20.8, isCorrect: true },
    { problemId: "p54", nickname: "ShadowRunner", rating: 1290, firstAttemptTime: 18.6, firstAttemptIsCorrect: false, timeTaken: 29.2, isCorrect: true },
    { problemId: "p57", nickname: "NeonKnight", rating: 1320, firstAttemptTime: 16.7, firstAttemptIsCorrect: true, timeTaken: 16.7, isCorrect: true },
    { problemId: "p61", nickname: "IronClaw", rating: 1355, firstAttemptTime: 15.1, firstAttemptIsCorrect: false, timeTaken: 26.5, isCorrect: false },
    { problemId: "p64", nickname: "EchoStorm", rating: 1390, firstAttemptTime: 13.6, firstAttemptIsCorrect: true, timeTaken: 13.6, isCorrect: true },
    { problemId: "p67", nickname: "AquaBlade", rating: 1425, firstAttemptTime: 12.3, firstAttemptIsCorrect: false, timeTaken: 23.0, isCorrect: true },
    { problemId: "p70", nickname: "VortexX", rating: 1450, firstAttemptTime: 11.1, firstAttemptIsCorrect: true, timeTaken: 11.1, isCorrect: true },
    { problemId: "p74", nickname: "StormySky", rating: 1485, firstAttemptTime: 10.0, firstAttemptIsCorrect: false, timeTaken: 20.7, isCorrect: false },
    { problemId: "p77", nickname: "BlazeRush", rating: 1520, firstAttemptTime: 9.0, firstAttemptIsCorrect: true, timeTaken: 9.0, isCorrect: true },
    { problemId: "p80", nickname: "SilentWolf", rating: 1550, firstAttemptTime: 8.3, firstAttemptIsCorrect: false, timeTaken: 18.4, isCorrect: true },
    { problemId: "p84", nickname: "CyberNova", rating: 1580, firstAttemptTime: 7.6, firstAttemptIsCorrect: true, timeTaken: 7.6, isCorrect: true },
    { problemId: "p87", nickname: "PixelRider", rating: 1615, firstAttemptTime: 7.0, firstAttemptIsCorrect: false, timeTaken: 16.8, isCorrect: false },
    { problemId: "p90", nickname: "NovaFlare", rating: 1650, firstAttemptTime: 6.5, firstAttemptIsCorrect: true, timeTaken: 6.5, isCorrect: true },
    { problemId: "p93", nickname: "IronShadow", rating: 1680, firstAttemptTime: 6.1, firstAttemptIsCorrect: false, timeTaken: 14.5, isCorrect: true },
    { problemId: "p95", nickname: "GhostFang", rating: 1710, firstAttemptTime: 5.8, firstAttemptIsCorrect: true, timeTaken: 5.8, isCorrect: true },
    { problemId: "p98", nickname: "FrostBite", rating: 1750, firstAttemptTime: 5.4, firstAttemptIsCorrect: false, timeTaken: 13.7, isCorrect: false },
    { problemId: "p100", nickname: "ThunderX", rating: 1780, firstAttemptTime: 5.1, firstAttemptIsCorrect: true, timeTaken: 5.1, isCorrect: true },
    { problemId: "p102", nickname: "NightShade", rating: 1820, firstAttemptTime: 4.9, firstAttemptIsCorrect: false, timeTaken: 12.6, isCorrect: true },
    { problemId: "p105", nickname: "ShadowFox", rating: 1850, firstAttemptTime: 4.7, firstAttemptIsCorrect: true, timeTaken: 4.7, isCorrect: true },
    { problemId: "p8", nickname: "달콤한꿀벌", rating: 810, firstAttemptTime: 56.5, firstAttemptIsCorrect: false, timeTaken: 59.8, isCorrect: true },
    { problemId: "p12", nickname: "별빛소녀", rating: 860, firstAttemptTime: 52.8, firstAttemptIsCorrect: true, timeTaken: 52.8, isCorrect: true },
    { problemId: "p15", nickname: "푸른바다", rating: 895, firstAttemptTime: 48.2, firstAttemptIsCorrect: false, timeTaken: 56.3, isCorrect: false },
    { problemId: "p18", nickname: "행복한코끼리", rating: 930, firstAttemptTime: 44.1, firstAttemptIsCorrect: true, timeTaken: 44.1, isCorrect: true },
    { problemId: "p21", nickname: "노란풍선", rating: 970, firstAttemptTime: 40.7, firstAttemptIsCorrect: false, timeTaken: 49.9, isCorrect: true },
    { problemId: "p25", nickname: "은빛달빛", rating: 1015, firstAttemptTime: 37.4, firstAttemptIsCorrect: true, timeTaken: 37.4, isCorrect: true },
    { problemId: "p29", nickname: "바람꽃", rating: 1060, firstAttemptTime: 34.0, firstAttemptIsCorrect: false, timeTaken: 43.8, isCorrect: false },
    { problemId: "p33", nickname: "푸른하늘", rating: 1100, firstAttemptTime: 30.7, firstAttemptIsCorrect: true, timeTaken: 30.7, isCorrect: true },
    { problemId: "p37", nickname: "하얀구름", rating: 1145, firstAttemptTime: 28.0, firstAttemptIsCorrect: false, timeTaken: 38.4, isCorrect: true },
    { problemId: "p42", nickname: "달빛사랑", rating: 1180, firstAttemptTime: 25.6, firstAttemptIsCorrect: true, timeTaken: 25.6, isCorrect: true },
    { problemId: "p45", nickname: "은하수", rating: 1215, firstAttemptTime: 23.2, firstAttemptIsCorrect: false, timeTaken: 34.7, isCorrect: false },
    { problemId: "p49", nickname: "산들바람", rating: 1248, firstAttemptTime: 21.0, firstAttemptIsCorrect: true, timeTaken: 21.0, isCorrect: true },
    { problemId: "p53", nickname: "조용한숲", rating: 1285, firstAttemptTime: 18.7, firstAttemptIsCorrect: false, timeTaken: 29.3, isCorrect: true },
    { problemId: "p56", nickname: "작은별", rating: 1318, firstAttemptTime: 16.9, firstAttemptIsCorrect: true, timeTaken: 16.9, isCorrect: true },
    { problemId: "p60", nickname: "파란나비", rating: 1350, firstAttemptTime: 15.3, firstAttemptIsCorrect: false, timeTaken: 26.8, isCorrect: false },
    { problemId: "p63", nickname: "초록숲", rating: 1385, firstAttemptTime: 13.8, firstAttemptIsCorrect: true, timeTaken: 13.8, isCorrect: true },
    { problemId: "p66", nickname: "붉은장미", rating: 1415, firstAttemptTime: 12.5, firstAttemptIsCorrect: false, timeTaken: 23.9, isCorrect: true },
    { problemId: "p69", nickname: "맑은물", rating: 1448, firstAttemptTime: 11.3, firstAttemptIsCorrect: true, timeTaken: 11.3, isCorrect: true },
    { problemId: "p73", nickname: "가을햇살", rating: 1480, firstAttemptTime: 10.1, firstAttemptIsCorrect: false, timeTaken: 21.4, isCorrect: false },
    { problemId: "p76", nickname: "푸른별", rating: 1515, firstAttemptTime: 9.1, firstAttemptIsCorrect: true, timeTaken: 9.1, isCorrect: true },
    { problemId: "p79", nickname: "바다향기", rating: 1540, firstAttemptTime: 8.5, firstAttemptIsCorrect: false, timeTaken: 18.8, isCorrect: true },
    { problemId: "p83", nickname: "달빛여행", rating: 1575, firstAttemptTime: 7.7, firstAttemptIsCorrect: true, timeTaken: 7.7, isCorrect: true },
    { problemId: "p86", nickname: "구름나무", rating: 1605, firstAttemptTime: 7.1, firstAttemptIsCorrect: false, timeTaken: 16.5, isCorrect: false },
    { problemId: "p89", nickname: "햇살가득", rating: 1640, firstAttemptTime: 6.6, firstAttemptIsCorrect: true, timeTaken: 6.6, isCorrect: true },
    { problemId: "p92", nickname: "눈꽃송이", rating: 1675, firstAttemptTime: 6.2, firstAttemptIsCorrect: false, timeTaken: 14.9, isCorrect: true },
    { problemId: "p94", nickname: "푸른하늘빛", rating: 1705, firstAttemptTime: 5.9, firstAttemptIsCorrect: true, timeTaken: 5.9, isCorrect: true },
    { problemId: "p97", nickname: "달콤한커피", rating: 1748, firstAttemptTime: 5.5, firstAttemptIsCorrect: false, timeTaken: 13.4, isCorrect: false },
    { problemId: "p99", nickname: "별바라기", rating: 1775, firstAttemptTime: 5.2, firstAttemptIsCorrect: true, timeTaken: 5.2, isCorrect: true },
    { problemId: "p101", nickname: "조용한바다", rating: 1810, firstAttemptTime: 4.9, firstAttemptIsCorrect: false, timeTaken: 12.8, isCorrect: true },
    { problemId: "p103", nickname: "하늘빛나", rating: 1845, firstAttemptTime: 4.7, firstAttemptIsCorrect: true, timeTaken: 4.7, isCorrect: true },
    { problemId: "p14", nickname: "청춘파도", rating: 820, firstAttemptTime: 55.3, firstAttemptIsCorrect: false, timeTaken: 59.1, isCorrect: true },
    { problemId: "p19", nickname: "무한도전러", rating: 875, firstAttemptTime: 50.9, firstAttemptIsCorrect: true, timeTaken: 50.9, isCorrect: true },
    { problemId: "p22", nickname: "별빛천사", rating: 900, firstAttemptTime: 48.0, firstAttemptIsCorrect: false, timeTaken: 54.5, isCorrect: false },
    { problemId: "p27", nickname: "달빛소나타", rating: 940, firstAttemptTime: 44.7, firstAttemptIsCorrect: true, timeTaken: 44.7, isCorrect: true },
    { problemId: "p31", nickname: "바람둥이", rating: 980, firstAttemptTime: 41.1, firstAttemptIsCorrect: false, timeTaken: 47.3, isCorrect: true },
    { problemId: "p35", nickname: "맑은햇살", rating: 1020, firstAttemptTime: 38.0, firstAttemptIsCorrect: true, timeTaken: 38.0, isCorrect: true },
    { problemId: "p39", nickname: "심야버스", rating: 1050, firstAttemptTime: 35.2, firstAttemptIsCorrect: false, timeTaken: 43.0, isCorrect: false },
    { problemId: "p43", nickname: "꽃길만걷자", rating: 1090, firstAttemptTime: 32.1, firstAttemptIsCorrect: true, timeTaken: 32.1, isCorrect: true },
    { problemId: "p47", nickname: "깡총깡총", rating: 1125, firstAttemptTime: 29.9, firstAttemptIsCorrect: false, timeTaken: 36.8, isCorrect: true },
    { problemId: "p51", nickname: "몽상가", rating: 1160, firstAttemptTime: 27.3, firstAttemptIsCorrect: true, timeTaken: 27.3, isCorrect: true },
    { problemId: "p55", nickname: "흔들리는별", rating: 1195, firstAttemptTime: 25.0, firstAttemptIsCorrect: false, timeTaken: 33.0, isCorrect: false },
    { problemId: "p59", nickname: "비오는거리", rating: 1230, firstAttemptTime: 22.7, firstAttemptIsCorrect: true, timeTaken: 22.7, isCorrect: true },
    { problemId: "p62", nickname: "햇살몽글", rating: 1260, firstAttemptTime: 20.9, firstAttemptIsCorrect: false, timeTaken: 29.8, isCorrect: true },
    { problemId: "p65", nickname: "별헤는밤", rating: 1290, firstAttemptTime: 19.0, firstAttemptIsCorrect: true, timeTaken: 19.0, isCorrect: true },
    { problemId: "p68", nickname: "음악중독", rating: 1320, firstAttemptTime: 17.6, firstAttemptIsCorrect: false, timeTaken: 26.2, isCorrect: false },
    { problemId: "p71", nickname: "낮술한잔", rating: 1355, firstAttemptTime: 16.1, firstAttemptIsCorrect: true, timeTaken: 16.1, isCorrect: true },
    { problemId: "p74", nickname: "밤샘러", rating: 1385, firstAttemptTime: 14.8, firstAttemptIsCorrect: false, timeTaken: 24.5, isCorrect: true },
    { problemId: "p77", nickname: "초코맛러브", rating: 1415, firstAttemptTime: 13.5, firstAttemptIsCorrect: true, timeTaken: 13.5, isCorrect: true },
    { problemId: "p80", nickname: "감성팔이", rating: 1448, firstAttemptTime: 12.2, firstAttemptIsCorrect: false, timeTaken: 21.8, isCorrect: false },
    { problemId: "p84", nickname: "하늘정원", rating: 1475, firstAttemptTime: 11.0, firstAttemptIsCorrect: true, timeTaken: 11.0, isCorrect: true },
    { problemId: "p87", nickname: "봄날의꽃", rating: 1500, firstAttemptTime: 10.1, firstAttemptIsCorrect: false, timeTaken: 20.5, isCorrect: true },
    { problemId: "p90", nickname: "달빛커피", rating: 1530, firstAttemptTime: 9.4, firstAttemptIsCorrect: true, timeTaken: 9.4, isCorrect: true },
    { problemId: "p93", nickname: "수줍은고양이", rating: 1555, firstAttemptTime: 8.7, firstAttemptIsCorrect: false, timeTaken: 18.9, isCorrect: false },
    { problemId: "p96", nickname: "노을빛향기", rating: 1585, firstAttemptTime: 8.1, firstAttemptIsCorrect: true, timeTaken: 8.1, isCorrect: true },
    { problemId: "p98", nickname: "소울메이트", rating: 1615, firstAttemptTime: 7.6, firstAttemptIsCorrect: false, timeTaken: 17.3, isCorrect: true },
    { problemId: "p100", nickname: "비밀의정원", rating: 1640, firstAttemptTime: 7.1, firstAttemptIsCorrect: true, timeTaken: 7.1, isCorrect: true },
    { problemId: "p102", nickname: "은하수별", rating: 1670, firstAttemptTime: 6.7, firstAttemptIsCorrect: false, timeTaken: 15.9, isCorrect: false },
    { problemId: "p105", nickname: "마카롱러버", rating: 1700, firstAttemptTime: 6.3, firstAttemptIsCorrect: true, timeTaken: 6.3, isCorrect: true },
    { problemId: "p107", nickname: "달콤쌉싸름", rating: 1725, firstAttemptTime: 6.0, firstAttemptIsCorrect: false, timeTaken: 14.7, isCorrect: true },
    { problemId: "p109", nickname: "파란꿈", rating: 1750, firstAttemptTime: 5.7, firstAttemptIsCorrect: true, timeTaken: 5.7, isCorrect: true },
    { problemId: "p11", nickname: "초코우유", rating: 1200, firstAttemptTime: 9.0, firstAttemptIsCorrect: false, timeTaken: 46.0, isCorrect: true },
    { problemId: "p16", nickname: "별밤", rating: 1180, firstAttemptTime: 8.5, firstAttemptIsCorrect: false, timeTaken: 46.0, isCorrect: false },
    { problemId: "p20", nickname: "구름다리", rating: 1150, firstAttemptTime: 7.8, firstAttemptIsCorrect: false, timeTaken: 42.0, isCorrect: true },
    { problemId: "p24", nickname: "무지개토끼", rating: 1130, firstAttemptTime: 7.6, firstAttemptIsCorrect: false, timeTaken: 44.0, isCorrect: false },
    { problemId: "p28", nickname: "달빛바람", rating: 1120, firstAttemptTime: 6.9, firstAttemptIsCorrect: false, timeTaken: 43.5, isCorrect: true },
    { problemId: "p32", nickname: "하늘연못", rating: 1100, firstAttemptTime: 6.5, firstAttemptIsCorrect: false, timeTaken: 40.5, isCorrect: false },
    { problemId: "p36", nickname: "꽃길만", rating: 1090, firstAttemptTime: 6.3, firstAttemptIsCorrect: false, timeTaken: 38.5, isCorrect: true },
    { problemId: "p40", nickname: "밤하늘", rating: 1070, firstAttemptTime: 6.0, firstAttemptIsCorrect: false, timeTaken: 36.0, isCorrect: false },
    { problemId: "p44", nickname: "은하별", rating: 1055, firstAttemptTime: 5.8, firstAttemptIsCorrect: false, timeTaken: 35.0, isCorrect: true },
    { problemId: "p48", nickname: "푸른달", rating: 1040, firstAttemptTime: 5.5, firstAttemptIsCorrect: false, timeTaken: 33.0, isCorrect: false },
    { problemId: "p52", nickname: "고요한밤", rating: 1020, firstAttemptTime: 5.3, firstAttemptIsCorrect: false, timeTaken: 32.0, isCorrect: true },
    { problemId: "p57", nickname: "작은별", rating: 1005, firstAttemptTime: 5.0, firstAttemptIsCorrect: false, timeTaken: 30.0, isCorrect: false },
    { problemId: "p61", nickname: "바람꽃", rating: 990, firstAttemptTime: 4.7, firstAttemptIsCorrect: false, timeTaken: 28.5, isCorrect: true },
    { problemId: "p64", nickname: "구름길", rating: 970, firstAttemptTime: 4.5, firstAttemptIsCorrect: false, timeTaken: 27.0, isCorrect: false },
    { problemId: "p67", nickname: "물방울", rating: 950, firstAttemptTime: 4.3, firstAttemptIsCorrect: false, timeTaken: 26.5, isCorrect: true },
    { problemId: "p70", nickname: "햇살", rating: 930, firstAttemptTime: 4.1, firstAttemptIsCorrect: false, timeTaken: 24.6, isCorrect: false },
    { problemId: "p75", nickname: "하늘빛", rating: 910, firstAttemptTime: 4.0, firstAttemptIsCorrect: false, timeTaken: 23.5, isCorrect: true },
    { problemId: "p78", nickname: "푸른바다", rating: 890, firstAttemptTime: 3.8, firstAttemptIsCorrect: false, timeTaken: 23.0, isCorrect: false },
    { problemId: "p81", nickname: "별빛", rating: 870, firstAttemptTime: 3.7, firstAttemptIsCorrect: false, timeTaken: 22.0, isCorrect: true },
    { problemId: "p85", nickname: "달빛", rating: 850, firstAttemptTime: 3.5, firstAttemptIsCorrect: false, timeTaken: 20.5, isCorrect: false },
    { problemId: "p88", nickname: "눈꽃", rating: 830, firstAttemptTime: 3.3, firstAttemptIsCorrect: false, timeTaken: 19.5, isCorrect: true },
    { problemId: "p91", nickname: "바람", rating: 815, firstAttemptTime: 3.0, firstAttemptIsCorrect: false, timeTaken: 18.0, isCorrect: false },
    { problemId: "p95", nickname: "고요", rating: 805, firstAttemptTime: 2.8, firstAttemptIsCorrect: false, timeTaken: 17.0, isCorrect: true },
    { problemId: "p99", nickname: "초록잎", rating: 800, firstAttemptTime: 2.6, firstAttemptIsCorrect: false, timeTaken: 16.0, isCorrect: false },
    { problemId: "p101", nickname: "푸른하늘", rating: 1200, firstAttemptTime: 9.8, firstAttemptIsCorrect: false, timeTaken: 50.0, isCorrect: true },
    { problemId: "p103", nickname: "햇빛가득", rating: 1100, firstAttemptTime: 9.2, firstAttemptIsCorrect: false, timeTaken: 48.0, isCorrect: false },
    { problemId: "p106", nickname: "달콤한하루", rating: 1300, firstAttemptTime: 7.5, firstAttemptIsCorrect: false, timeTaken: 40.0, isCorrect: true },
    { problemId: "p108", nickname: "여름밤", rating: 1250, firstAttemptTime: 8.0, firstAttemptIsCorrect: false, timeTaken: 42.0, isCorrect: false },
    { problemId: "p110", nickname: "봄바람", rating: 1350, firstAttemptTime: 6.5, firstAttemptIsCorrect: false, timeTaken: 35.0, isCorrect: true },
    { problemId: "p112", nickname: "가을햇살", rating: 1400, firstAttemptTime: 5.9, firstAttemptIsCorrect: false, timeTaken: 31.0, isCorrect: false },
    { problemId: "p115", nickname: "파란별", rating: 1450, firstAttemptTime: 5.2, firstAttemptIsCorrect: false, timeTaken: 27.0, isCorrect: true },
    { problemId: "p1", nickname: "바람꽃", rating: 2300, firstAttemptTime: 1.7, firstAttemptIsCorrect: false, timeTaken: 9.0, isCorrect: true },
    { problemId: "p2", nickname: "별빛", rating: 2280, firstAttemptTime: 1.6, firstAttemptIsCorrect: false, timeTaken: 8.5, isCorrect: false },
    { problemId: "p3", nickname: "하늘연못", rating: 2250, firstAttemptTime: 2.0, firstAttemptIsCorrect: false, timeTaken: 9.5, isCorrect: true },
    { problemId: "p4", nickname: "푸른달", rating: 2200, firstAttemptTime: 1.8, firstAttemptIsCorrect: false, timeTaken: 8.7, isCorrect: false },
    { problemId: "p5", nickname: "구름다리", rating: 2150, firstAttemptTime: 1.9, firstAttemptIsCorrect: false, timeTaken: 9.2, isCorrect: true },
    { problemId: "p6", nickname: "달빛소나타", rating: 1800, firstAttemptTime: 3.5, firstAttemptIsCorrect: false, timeTaken: 22.0, isCorrect: false },
    { problemId: "p7", nickname: "초코우유", rating: 1750, firstAttemptTime: 3.7, firstAttemptIsCorrect: false, timeTaken: 23.0, isCorrect: true },
    { problemId: "p8", nickname: "햇살", rating: 1700, firstAttemptTime: 4.0, firstAttemptIsCorrect: false, timeTaken: 23.5, isCorrect: false },
    { problemId: "p9", nickname: "꽃길만", rating: 1600, firstAttemptTime: 4.1, firstAttemptIsCorrect: false, timeTaken: 22.5, isCorrect: true },
    { problemId: "p10", nickname: "별헤는밤", rating: 1550, firstAttemptTime: 4.5, firstAttemptIsCorrect: false, timeTaken: 24.0, isCorrect: false },
    { problemId: "p11", nickname: "푸른바다", rating: 1500, firstAttemptTime: 4.7, firstAttemptIsCorrect: false, timeTaken: 24.5, isCorrect: true },
    { problemId: "p12", nickname: "달빛바람", rating: 1480, firstAttemptTime: 4.9, firstAttemptIsCorrect: false, timeTaken: 25.0, isCorrect: false },
    { problemId: "p13", nickname: "가을햇살", rating: 1450, firstAttemptTime: 4.6, firstAttemptIsCorrect: false, timeTaken: 23.0, isCorrect: true },
    { problemId: "p14", nickname: "하늘빛", rating: 1400, firstAttemptTime: 4.8, firstAttemptIsCorrect: false, timeTaken: 24.0, isCorrect: false },
    { problemId: "p15", nickname: "푸른별", rating: 1380, firstAttemptTime: 4.4, firstAttemptIsCorrect: false, timeTaken: 21.0, isCorrect: true },
    { problemId: "p16", nickname: "바람길", rating: 1300, firstAttemptTime: 5.2, firstAttemptIsCorrect: false, timeTaken: 26.5, isCorrect: false },
    { problemId: "p17", nickname: "초록잎", rating: 1250, firstAttemptTime: 5.5, firstAttemptIsCorrect: false, timeTaken: 27.0, isCorrect: true },
    { problemId: "p18", nickname: "푸른하늘", rating: 1200, firstAttemptTime: 5.6, firstAttemptIsCorrect: false, timeTaken: 28.0, isCorrect: false },
    { problemId: "p19", nickname: "밤하늘", rating: 1150, firstAttemptTime: 5.7, firstAttemptIsCorrect: false, timeTaken: 28.5, isCorrect: true },
    { problemId: "p20", nickname: "별빛속으로", rating: 1100, firstAttemptTime: 6.0, firstAttemptIsCorrect: false, timeTaken: 29.5, isCorrect: false },
    { problemId: "p21", nickname: "바람꽃", rating: 1050, firstAttemptTime: 6.5, firstAttemptIsCorrect: false, timeTaken: 32.0, isCorrect: true },
    { problemId: "p22", nickname: "눈꽃", rating: 1000, firstAttemptTime: 6.7, firstAttemptIsCorrect: false, timeTaken: 33.0, isCorrect: false },
    { problemId: "p23", nickname: "고요한밤", rating: 950, firstAttemptTime: 7.0, firstAttemptIsCorrect: false, timeTaken: 34.0, isCorrect: true },
    { problemId: "p24", nickname: "물방울", rating: 900, firstAttemptTime: 7.2, firstAttemptIsCorrect: false, timeTaken: 35.0, isCorrect: false },
    { problemId: "p25", nickname: "초코우유", rating: 860, firstAttemptTime: 7.4, firstAttemptIsCorrect: false, timeTaken: 38.0, isCorrect: true },
    { problemId: "p26", nickname: "푸른달", rating: 840, firstAttemptTime: 7.8, firstAttemptIsCorrect: false, timeTaken: 40.0, isCorrect: false },
    { problemId: "p27", nickname: "별헤는밤", rating: 820, firstAttemptTime: 8.0, firstAttemptIsCorrect: false, timeTaken: 43.0, isCorrect: true },
    { problemId: "p28", nickname: "달빛", rating: 810, firstAttemptTime: 8.3, firstAttemptIsCorrect: false, timeTaken: 45.0, isCorrect: false },
    { problemId: "p1", nickname: "푸른바다", rating: 800, firstAttemptTime: 8.5, firstAttemptIsCorrect: false, timeTaken: 48.0, isCorrect: true },
    { problemId: "p1", nickname: "가을바람", rating: 790, firstAttemptTime: 8.7, firstAttemptIsCorrect: false, timeTaken: 50.0, isCorrect: false }

];