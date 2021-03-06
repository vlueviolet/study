<script id="teamList-template" type="text/x-handlebars-template">
<ul class="list_team">
{{#each teams}}
<li class="team_item">
    <a href="#" class="team_logo" data-team-no="{{team_no}}">
        <span class="team_img">
            {{#if logo_img.length}}
            <img src="{{logo_img}}" alt="{{team_name}}">
            {{else}}
            <img src="../images/team/@team_logo_big_default.png" alt="팀">
            {{/if}}
        </span>
        {{#teamName team_name}}
        <em class="team">{{team_name}}</em>
        {{else}}
        <em class="team">팀명이 없습니다.(handlebars)</em>
        {{/teamName}}
        <span class="btn_view">상세 정보 보기</span>
    </a>
</li>
{{/each}}
</ul>
</script>