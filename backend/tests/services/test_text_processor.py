import pytest
from app.services.text_processor import TextProcessor

def test_preprocess_text_basic():
    """测试基本的文本预处理（移除首尾空白）"""
    text = "  Hello World  "
    expected = "Hello World"
    assert TextProcessor.preprocess_text(text) == expected

def test_preprocess_text_newlines():
    """测试换行符标准化"""
    text = "Line 1\r\nLine 2\rLine 3"
    expected = "Line 1\nLine 2\nLine 3"
    assert TextProcessor.preprocess_text(text) == expected

def test_preprocess_text_consecutive_newlines():
    """测试连续换行符压缩"""
    text = "Line 1\n\n\n\nLine 2"
    expected = "Line 1\n\nLine 2"
    assert TextProcessor.preprocess_text(text) == expected

def test_preprocess_text_line_stripping():
    """测试每行首尾空白移除"""
    text = "  Line 1  \n  Line 2  "
    expected = "Line 1\nLine 2"
    assert TextProcessor.preprocess_text(text) == expected

def test_preprocess_text_whitespace_lines():
    """测试仅包含空白字符的行"""
    # 这是一个当前的潜在 bug：如果空行包含空格，目前的实现可能不会正确压缩连续换行
    text = "Line 1\n  \n  \nLine 2"
    # 我们期望它被处理为 Line 1\n\nLine 2
    expected = "Line 1\n\nLine 2"
    assert TextProcessor.preprocess_text(text) == expected

def test_preprocess_text_empty():
    """测试空字符串"""
    assert TextProcessor.preprocess_text("") == ""
    assert TextProcessor.preprocess_text("   ") == ""
    assert TextProcessor.preprocess_text("\n\n") == ""

def test_preprocess_text_complex():
    """测试复杂组合情况"""
    text = """

    Start


    Middle




    End

    """
    # 期望：
    # 1. 移除首尾换行
    # 2. 压缩中间过多的换行
    # 3. 每行 strip
    expected = "Start\n\nMiddle\n\nEnd"
    result = TextProcessor.preprocess_text(text)
    assert result == expected
