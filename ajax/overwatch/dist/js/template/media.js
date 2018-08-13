<script id="mediaList-template" type="text/x-handlebars-template">
{{#each medias}}
<li class="media_item">
<a href="#" class="video btn_play">
        <span class="thumb"><img src="{{thumbnail}}" alt=""></span>
        <div class="media_info">
            <span class="tit">{{title}}</span>
            <ul class="list">
                <li class="sort">{{sort}}</li>
            </ul>
        </div>
    </a>
</li>
{{/each}}
</script>