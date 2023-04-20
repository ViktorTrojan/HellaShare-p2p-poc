#pragma once
#include <map>
#include <tuple>
#include <string>
#include <saucer/webview.hpp>

#include "assets/index-4769ebaa.css.hpp"
#include "assets/index-cf120de1.js.hpp"
#include "clickSound.mp3.hpp"
#include "index.html.hpp"
#include "logo.png.hpp"

namespace embedded {
	inline auto get_all_files() {
		std::map<const std::string, const saucer::embedded_file> rtn;
		rtn.emplace("assets/index-4769ebaa.css", saucer::embedded_file{"text/css", 6861, embedded_assets_index_4769ebaa_css});
		rtn.emplace("assets/index-cf120de1.js", saucer::embedded_file{"application/javascript", 476603, embedded_assets_index_cf120de1_js});
		rtn.emplace("clickSound.mp3", saucer::embedded_file{"audio/mpeg", 2772479, embedded_clickSound_mp3});
		rtn.emplace("index.html", saucer::embedded_file{"text/html", 463, embedded_index_html});
		rtn.emplace("logo.png", saucer::embedded_file{"image/png", 39580, embedded_logo_png});
		return rtn;
	}
} // namespace embedded