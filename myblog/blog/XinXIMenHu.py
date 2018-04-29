# coding:utf-8
import urllib.parse, urllib.request, http.cookiejar, re, json
from bs4 import BeautifulSoup


def main(id, password):
    url = 'http://ids.chd.edu.cn/authserver/login?service=http://portal.chd.edu.cn/index.portal'
    hosturl = 'http://ids.chd.edu.cn/authserver/login?service=http%3A%2F%2Fportal.chd.edu.cn%2F'
    
    cj = http.cookiejar.CookieJar()
    handler = urllib.request.HTTPCookieProcessor(cj)
    opener = urllib.request.build_opener(handler)
    urllib.request.install_opener(opener)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_2 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) '
                      'Version/6.0 Mobile/10B146 Safari/8536.25'
    }
    # 注意decode()
    w = urllib.request.urlopen(hosturl).read().decode('utf8')
    reg = 'LT-[^"]*?cas'
    l = re.compile(reg)
    ltt = re.findall(l, w)
    for i in ltt:
        lt = i
    postdata = {
        'username': id, 'password': str(password), 'lt': lt, 'dllt': 'userNamePasswordLogin', 'execution': 'e1s1',
        '_eventId': 'submit', 'rmShown': '1'
    }
    
    postdata = urllib.parse.urlencode(postdata).encode(encoding = 'utf8')
    request = urllib.request.Request(url, postdata, headers)
    data = urllib.request.urlopen(request).read().decode('utf8')
    
    if 'http://www.w3.org/1999/xhtml' not in str(data):
        j = json.dumps({"登陆": "失败"}, ensure_ascii = False, indent = 4)
        return j
    
    card_number = []
    date = []
    time = []
    place = []
    money = []
    balance = []
    
    def get(page):
        card_url = 'http://portal.chd.edu.cn/pnull.portal?rar=0.5440574374348891&.pmn=view&.ia=false&action=showItem' \
                   '&.pen' \
                   '=pe950&itemId=601&childId=621&page=' + str(page)
        postdata = {
        
        }
        request = urllib.request.Request(card_url, headers = headers)
        data = urllib.request.urlopen(request).read().decode('utf8')
        soup = BeautifulSoup(data, 'html.parser')
        soup = soup.select('td')
        # print(soup)
        soup = str(soup).splitlines()
        for i in range(len(soup)):
            if '...' in soup[i]:
                card_number.append(re.sub('\s', '', soup[i - 20]))
                date.append(re.sub('\s', '', soup[i - 13]))
                time.append(re.sub('\s', '', soup[i - 6]))
                place.append(re.sub('\s|\.{3}', '', soup[i]))
                money.append(re.sub('\s', '', soup[i + 8]))
                balance.append(re.sub('\s', '', soup[i + 15]))
    
    for i in range(1, 100):
        get(i)
        if len(card_number) > 50:
            break
    """
    print(card_number)
    print(date)
    print(time)
    print(place)
    print(money)
    print(balance)
    """
    data = {}
    
    for i in range(50):
        t = {}
        t["一卡通账号"] = card_number[i]
        t["交易日期"] = date[i]
        t["交易时间"] = time[i]
        t["交易地点"] = place[i]
        t["交易金额"] = money[i]
        t["交易余额"] = balance[i]
        data[i + 1] = t
    j = json.dumps(data, ensure_ascii = False, indent = 4)
    return j
