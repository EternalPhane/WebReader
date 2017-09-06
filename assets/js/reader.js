(function() {
    var Reader = (function() {
        var reader = {
            init: function() {
                var init = function() {
                    this.toggleNight(this.preferences.night);
                    this.setFontSize(this.preferences.fontSize);
                    this.preferences.themes.forEach(function(e, i) {
                        $('<button class="btn btn-color" type="button" value="' + i + '"></button>')
                            .css('background-color', e.background)
                            .appendTo('#reader-theme');
                    });
                    $('.reader-action-center-v').click(this, function(e) {
                        e.preventDefault();
                        e.data.toggleBars();
                    });
                    $('#reader-content, .m-reader-action').on('touchmove', this, function(e) {
                        e.data.toggleBars(false);
                    });
                    $('#item-font').click(this, function(e) {
                        e.preventDefault();
                        e.data.toggleFont();
                    });
                    $('#item-night').click(this, function(e) {
                        e.preventDefault();
                        e.data.toggleNight();
                    });
                    $('#reader-font-size')
                        .val(this.preferences.fontSize)
                        .on('input', this, function(e) {
                            e.data.setFontSize(+this.value);
                        });
                    $('#reader-theme > button').click(this, function(e) {
                        $(this)
                            .siblings().removeClass('active').end()
                            .addClass('active');
                        e.data.setTheme(+this.value);
                    });
                }.bind(this);
                $.base64.utf8encode = true;
                this.toggleBars(false);
                this.preferences = JSON.parse(localStorage.getItem('preferences'));
                if (null === this.preferences) {
                    $.ajax({
                        url: 'data/preferences.json',
                        method: 'GET',
                        dataType: 'json',
                        context: this,
                        success: function(preferences) {
                            this.preferences = preferences;
                            init();
                        }
                    });
                } else {
                    init();
                }
            },
            toggleBars: function(visible) {
                this.toggleFont(false);
                if ('undefined' === typeof visible) {
                    $('.navbar').toggle();
                } else if (visible) {
                    $('.navbar').show();
                } else {
                    $('.navbar').hide();
                }
            },
            toggleFont: function(visible) {
                if ('undefined' === typeof visible) {
                    $('#item-bar-font').toggle();
                } else if (visible) {
                    $('#item-bar-font').show();
                } else {
                    $('#item-bar-font').hide();
                }
            },
            toggleNight: function(night) {
                var img;
                var text;
                this.preferences.night = !this.preferences.night;
                if ('undefined' !== typeof night) {
                    this.preferences.night = night;
                }
                img = this.preferences.night ? 'sun' : 'moon';
                text = this.preferences.night ? '白天' : '夜间';
                $('#item-night')
                    .find('img').attr('src', 'assets/img/' + img + '-o.svg').end()
                    .find('span').text(text).end();
                this.setTheme();
            },
            setFontSize: function(fontSize) {
                if ('undefined' !== typeof fontSize) this.preferences.fontSize = fontSize;
                $('#reader-content > p').css('font-size', this.preferences.fontSize);
            },
            setTheme: function(index) {
                var theme;
                if ('undefined' !== typeof index) this.preferences.theme = index;
                theme = this.preferences.night
                    ? this.preferences.nightTheme
                    : this.preferences.themes[this.preferences.theme];
                $('body').css('background-color', theme.background);
                $('#reader-content').css('background-color', theme.background);
                $('#reader-content').css('color', theme.font);
            },
            showChapter: function(index, title) {
                $('#reader-content').empty();
                this.chapter = index;
                $.ajax({
                    url: 'data/{novel}/{chapter}.json'
                        .replace('{novel}', $.base64.btoa(this.novel.name))
                        .replace('{chapter}', index),
                    method: 'GET',
                    dataType: 'json',
                    context: this,
                    success: function(chapter) {
                        $('#reader-content').html(
                            '<h5>' + title + '</h5>'
                            + '<p>' + chapter.content.split('\n').join('</p><p>') + '</p>'
                        );
                        this.setFontSize();
                    }
                });
            }
        };
        for (var key in reader) {
            if ('function' === typeof key) {
                reader[key] = reader[key].bind(reader);
            }
        }
        return reader;
    })();

    window.Reader = Reader;
})();