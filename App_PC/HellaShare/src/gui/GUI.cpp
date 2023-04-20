#include "GUI.hpp"

#include "../../embedding/all.hpp"
#include <saucer/smartview.hpp>
#include <saucer/utils/future.hpp>
#include <saucer/serializers/json.hpp>

#include <vector>
#include <iostream>
#include <Windows.h>

void exposes(saucer::simple_smartview<saucer::serializers::json>& gui) {
	char username[100];
	DWORD username_len = 100;
	GetUserNameA(username, &username_len);

	// returns the Username of the Current User
	gui.expose("exposed_getPCUsername", [=]() -> std::string {return username; });
}

void debug() {
	saucer::simple_smartview<saucer::serializers::json> gui;
	
	exposes(gui);

	// TODO: this only for safety here, remove when its fixed
	Sleep(100);

	gui.set_title("HellaShare");
	gui.set_url("http://localhost:5173/");
	gui.set_context_menu(false);
	gui.set_decorations(true);
	gui.set_size(400, 600);
	gui.set_background_color(0, 0, 0, 0);
	gui.set_dev_tools(true);
	gui.show();
	gui.run();
}

void build() {
	saucer::simple_smartview<saucer::serializers::json> gui;
	gui.set_title("Hellashare");
	gui.embed_files(std::move(embedded::get_all_files()));

	exposes(gui);

	// TODO: this only for safety here, remove when its fixed
	Sleep(100);

	gui.serve_embedded("index.html");
	gui.set_context_menu(false);
	gui.set_decorations(true);
	gui.set_size(400, 600);
	gui.set_background_color(0, 0, 0, 0);
	gui.set_dev_tools(true);
	gui.show();
	gui.run();
}

void GUI::start() {
	//debug();
	build();
}