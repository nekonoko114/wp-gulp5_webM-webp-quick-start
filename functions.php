<?php
add_theme_support('title-tag');
add_theme_support('post-thumbnails');
add_theme_support('automatic-feed-links');
add_theme_support(
  'html5',
  array(
    'commnt-list',
    'commnt-form',
    'serch-form',
    'gallery',
    'caption'
  )
);

//カスタムメニューの追加
function my_menu_init()
{
  register_nav_menus(
    array(
      'header' => 'ヘッダーメニュー',
      'drawer' => 'ドロワーメニュー',
      'footer' => 'フッターメニュー'
    )
  );
}
add_action('init', 'my_menu_init');


/**メニューそれぞれのクラスを変更することができるカスタマイズ
 * theme_locationごとに分岐できる
 * @parame
 * header,drawer,footer
 */
add_filter('wp_nav_menu_args', function ($args) {
  if ($args['theme_location'] === 'header') {
    // ヘッダーメニューのカスタムクラス
    $args['menu_class']   = 'header-ul';
    $args['add_li_class'] = 'header-li';
  } elseif ($args['theme_location'] === 'footer') {
    // フッターメニューのカスタムクラス
    $args['menu_class']   = 'footer-lists';
    $args['add_li_class'] = 'footer-item';
  }
  return $args;
});


//投稿のデフォルトスタイルを変更する
add_filter('nav_menu_css_class', function ($classes, $item, $args, $depth) {
  if (isset($args->add_li_class)) {
    $classes[] = $args->add_li_class; // 任意のクラスを追加
  }
  return $classes;
}, 10, 4);


//ウィジェットサイドバーの登録
function my_theme_widgets_init()
{
  register_sidebar(array(
    'name'          => 'サイドバー',
    'id'            => 'sidebar-1',
    'description'   => 'サイドバーウィジェットエリア',
    'before_widget' => '<div class="widget">',
    'after_widget'  => '</div>',
    'before_title'  => '<h2 class="widget-title">',
    'after_title'   => '</h2>',
  ));
}
add_action('widgets_init', 'my_theme_widgets_init');


function add_twitter_embed_script()
{
  if (is_active_sidebar('sidebar-1')) { // サイドバーがアクティブなときのみ
    wp_enqueue_script('twitter-widgets', 'https://platform.twitter.com/widgets.js', array(), null, true);
  }
}
add_action('wp_enqueue_scripts', 'add_twitter_embed_script');

function custom_excerpt_more($more)
{
  return ' <a class="c-btn c-btn-more-right" href="' . get_permalink() . '">もっと見る</a>'; // 「続きを読む」ボタンを追加
}
add_filter('excerpt_more', 'custom_excerpt_more');

//カスタムヘッダー
function theme_custom_header_setup() {
  $args = array(
      'default-image'          => '',  // デフォルトの画像（なし）
      'random-default'         => false,
      'width'                  => 1200,  // 画像のデフォルト幅
      'height'                 => 600,   // 画像のデフォルト高さ
      'flex-width'             => true,  // 幅の調整を許可
      'flex-height'            => true,  // 高さの調整を許可
      'uploads'                => true,  // 画像のアップロードを許可
      'wp-head-callback'       => 'theme_header_style', // ヘッダーのスタイルを適用
  );
  add_theme_support('custom-header', $args);
}
add_action('after_setup_theme', 'theme_custom_header_setup');

//管理画面でアップロードしたヘッダー画像を CSS に反映 するための関数
function theme_header_style() {
  if (get_header_image()) { // ヘッダー画像がある場合のみ適用
      ?>
      <style type="text/css">
          .custom-header img{
              /* background-image: url('<?php echo esc_url(get_header_image()); ?>'); */
              background-size: cover;
              background-position: center;
              object-fit: cover;
              height: <?php echo get_custom_header()->height; ?>px;
              width: 100%;
          }
      </style>
      <?php
  }
}
