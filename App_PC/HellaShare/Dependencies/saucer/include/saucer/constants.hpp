#pragma once
#define SAUCER_ENABLE_ASSERTS ON
#define SAUCER_CURRENT_BACKEND webview2
#define SAUCER_BACKEND_VERSION 2

namespace saucer
{
    enum class backend_type
    {
        qt5,
        qt6,
        webview2,
    };

    enum class assert_value : bool
    {
        ON = true,
        OFF = false
    };

    constexpr backend_type backend = backend_type::SAUCER_CURRENT_BACKEND;
    constexpr bool enable_assert = static_cast<bool>(assert_value::SAUCER_ENABLE_ASSERTS);
} // namespace saucer
