module Jekyll
  class DraftFilter < Generator
    priority :high

    def generate(site)
      site.pages.reject! { |page| page.data['draft'] == true }
    end
  end
end
