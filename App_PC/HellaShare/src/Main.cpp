#include "gui/GUI.hpp"

#include <Windows.h>


int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PWSTR pCmdLine, int nCmdShow){
	GUI gui;
	gui.start();
}