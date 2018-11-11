if(typeof paycosearchAutocompleteUrl != 'undefined') {
    var HeaderSearch = { // 설정용가능한 항목을 모두 설정한 config
        'documentElement' : window.document,

        // 자동완성 결과를 보여주는 엘리먼트
        'resultListElement': $('#frmSearchTop .auto-area', window.document),

        // 검색어를 입력하는 input 엘리먼트
        'searchBoxElement': $('#frmSearchTop input[name=keyword]', window.document),

        // 입력한 검색어를 넘기기 위한 hidden element
        'orgQueryElement' : $('#frmSearchTop #org_query', window.document),

        // on,off 버튼 엘리먼트
        'toggleBtnElement' : $("#frmSearchTop #onoffBtn", window.document),

        // on,off 상태를 알리는 엘리먼트
        'onoffTextElement' : $("#frmSearchTop .autocomplete-area", window.document),

        // on, off상태일때 변경 이미지 경로
        'toggleImg' : {
            'on' : '',
            'off' : '',
        },

        // 컬렉션아이템별 보여질 리스트 개수
        'viewCount' : 10,

        // 서브쿼리로 넘어갈 키 값들의 배열(컬렉션 명 별로 지정 할 수 있다, 따로 지정하지 않으면 defaults가 적용된다.)
        'subQuerySet': [
            ['title_no', 'title_thumbnail_url', 'author_org']
        ],

        // 컬렉션 인덱스별 자동완성 리스트의 config를 설정한다.
        'listConfig': {
            '0': {
                'template': 'plain',
                'action': 10
            }
        },

        // 컬렉션 타입 별로 표시될 마크업, 데이터가 들어갈 부분은 @key@ 형식으로 사용한다.(지정하지 않으면, defaults가 적용된다.)
        // 형식은 수정 가능하지만, keyword-field는 키워드가 들어가는 부분에 필수로 들어가야함. 단 title에는 들어가면 안됨.
        'template' :  {
            plain : {
                element: '<li class="srch"><a href="#" class="keyword-field">@subject@</a></li>',
                attr: ['subject']
            },
            title: {
                element: '<li class="title">&nbsp;<b>@title@</b></li>',
                attr: ['title']
            },
            defaults: {
                element: '<li class="srch"><span class="keyword-field">@subject@</span></li>',
                attr: ['subject']
            }
        },

        // 컬렉션 타입별 form action 을 지정한다. (지정하지 않으면 defaults가 적용된다)
        'actions': [
            ""
        ],

        // 컬렉션 타입별 추가 스테틱한 옵션들을 설정
        'staticParams':[
            "qt=ProductName",
            "qt=CompanyName",
            "at=TEST,bt=ACT"
        ],
        // 타이틀을 보일지 여부
        'useTitle': false,

        // 검색창을 감싸고 있는 form앨리먼트
        'formElement' : $("#frmSearchTop", window.document),

        // 자동완성을 끄고 켤때 사용되는 쿠키명
        'cookieName' : "usecookie",

        // 선택된 엘리먼트에 추가되는 클래스명
        'mouseOverClass' : 'emp',

        // 자동완성API url
        'searchUrl' : paycosearchAutocompleteUrl,

        // 자동완성API request 설정
        'searchApi' : {
            'title' : "상품명"
        }
    };
    new tui.component.AutoComplete({"config" : HeaderSearch});

    var bodySearch = { // 설정용가능한 항목을 모두 설정한 config
        'documentElement' : window.document,

        // 자동완성 결과를 보여주는 엘리먼트
        'resultListElement': $('#frmSearch .auto-area', window.document),

        // 검색어를 입력하는 input 엘리먼트
        'searchBoxElement': $('#frmSearch input[name="keyword"]', window.document),

        // 입력한 검색어를 넘기기 위한 hidden element
        'orgQueryElement' : $('#frmSearch #org_query', window.document),

        // on,off 버튼 엘리먼트
        'toggleBtnElement' : $("#frmSearch #onoffBtn", window.document),

        // on,off 상태를 알리는 엘리먼트
        //'onoffTextElement' : $("#frmSearch .autocomplete-area", window.document),

        // on, off상태일때 변경 이미지 경로
        'toggleImg' : {
            'on' : '',
            'off' : '',
        },

        // 컬렉션아이템별 보여질 리스트 개수
        'viewCount' : 10,

        // 서브쿼리로 넘어갈 키 값들의 배열(컬렉션 명 별로 지정 할 수 있다, 따로 지정하지 않으면 defaults가 적용된다.)
        'subQuerySet': [
            ['title_no', 'title_thumbnail_url', 'author_org']
        ],

        // 컬렉션 인덱스별 자동완성 리스트의 config를 설정한다.
        'listConfig': {
            '0': {
                'template': 'plain',
                'action': 10
            }
        },

        // 컬렉션 타입 별로 표시될 마크업, 데이터가 들어갈 부분은 @key@ 형식으로 사용한다.(지정하지 않으면, defaults가 적용된다.)
        // 형식은 수정 가능하지만, keyword-field는 키워드가 들어가는 부분에 필수로 들어가야함. 단 title에는 들어가면 안됨.
        'template' :  {
            plain : {
                element: '<li class="srch"><a href="#" class="keyword-field">@subject@</a></li>',
                attr: ['subject']
            },
            title: {
                element: '<li class="title">&nbsp;<b>@title@</b></li>',
                attr: ['title']
            },
            defaults: {
                element: '<li class="srch"><span class="keyword-field">@subject@</span></li>',
                attr: ['subject']
            }
        },

        // 컬렉션 타입별 form action 을 지정한다. (지정하지 않으면 defaults가 적용된다)
        'actions': [
            ""
        ],

        // 컬렉션 타입별 추가 스테틱한 옵션들을 설정
        'staticParams':[
            "qt=ProductName",
            "qt=CompanyName",
            "at=TEST,bt=ACT"
        ],
        // 타이틀을 보일지 여부
        'useTitle': false,

        // 검색창을 감싸고 있는 form앨리먼트
        'formElement' : $("#frmSearch", window.document),

        // 자동완성을 끄고 켤때 사용되는 쿠키명
        'cookieName' : "usecookie",

        // 선택된 엘리먼트에 추가되는 클래스명
        'mouseOverClass' : 'emp',

        // 자동완성API url
        'searchUrl' : paycosearchAutocompleteUrl,

        // 자동완성API request 설정
        'searchApi' : {
            'title' : "상품명"
        }
    };

    new tui.component.AutoComplete({"config" : bodySearch});

}
