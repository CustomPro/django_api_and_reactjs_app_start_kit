from preview_generator.manager import PreviewManager

Height = 1024  # PIL color to use for "on"
WIDTH = 526  # PIL color to use for "off"
PAGE_ID = 1

def main():
    image = text_image('content.txt')
    image.show()
    image.save('content.png')


def pdf_to_image(cach_dir_path, pdf_file_path, font_path=None):
    """Convert text file to a grayscale image with black characters on a white background.

    arguments:
    text_path - the content of this file will be converted to an image
    font_path - path to a font file (for example impact.ttf)
    """
    preview_manager = PreviewManager(cach_dir_path, create_folder= True)
    preview = preview_manager.get_jpeg_preview(pdf_file_path, height=Height,width=WIDTH)
    return preview

if __name__ == '__main__':
    main()